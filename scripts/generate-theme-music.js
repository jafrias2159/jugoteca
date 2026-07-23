const fs = require('fs')
const path = require('path')

const SAMPLE_RATE = 16000

const NOTE_INDEX = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteFreq(note) {
  const [, letter, octaveStr] = note.match(/^([A-G]#?)(\d)$/)
  const octave = Number(octaveStr)
  const semitonesFromA4 = (octave - 4) * 12 + (NOTE_INDEX[letter] - 9)
  return 440 * Math.pow(2, semitonesFromA4 / 12)
}

function transposeNote(note, semitones) {
  const [, letter, octaveStr] = note.match(/^([A-G]#?)(\d)$/)
  const octave = Number(octaveStr)
  const raw = NOTE_INDEX[letter] + semitones
  const wrapped = ((raw % 12) + 12) % 12
  const octaveShift = Math.floor(raw / 12)
  return `${NOTE_NAMES[wrapped]}${octave + octaveShift}`
}

function squareWave(freq, duration, dutyCycle, volume, sampleRate) {
  const samples = Math.round(sampleRate * duration)
  const period = sampleRate / freq
  const out = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const phase = (i % period) / period
    out[i] = (phase < dutyCycle ? 1 : -1) * volume
  }
  return out
}

function noiseBurst(duration, volume, sampleRate) {
  const samples = Math.round(sampleRate * duration)
  const out = new Float32Array(samples)
  for (let i = 0; i < samples; i++) out[i] = (Math.random() * 2 - 1) * volume
  return out
}

function applyEnvelope(samples, attackMs, releaseMs, sampleRate) {
  const attack = Math.round((attackMs / 1000) * sampleRate)
  const release = Math.round((releaseMs / 1000) * sampleRate)
  const n = samples.length
  for (let i = 0; i < attack && i < n; i++) samples[i] *= i / attack
  for (let i = 0; i < release && i < n; i++) samples[n - 1 - i] *= i / release
  return samples
}

function mixInto(dest, src, offsetSamples) {
  for (let i = 0; i < src.length; i++) {
    const idx = offsetSamples + i
    if (idx >= 0 && idx < dest.length) dest[idx] += src[i]
  }
}

// Base progressions written in C major / G major; each song transposes these
// by a fixed number of semitones so 5 keys x 3 timbres = 15 distinct tracks
// without hand-writing 15 separate compositions.
const BASE_PROGRESSION_I = [
  { bass: ['C3', 'G3'], arp: ['C5', 'E5', 'G5', 'C6'] },
  { bass: ['G3', 'D4'], arp: ['G4', 'B4', 'D5', 'G5'] },
  { bass: ['A3', 'E4'], arp: ['A4', 'C5', 'E5', 'A5'] },
  { bass: ['F3', 'C4'], arp: ['F4', 'A4', 'C5', 'F5'] },
]

const BASE_PROGRESSION_II = [
  { bass: ['G3', 'D4'], arp: ['B4', 'D5', 'G5', 'B5'] },
  { bass: ['D3', 'A3'], arp: ['D5', 'F#5', 'A5', 'D6'] },
  { bass: ['E3', 'B3'], arp: ['E5', 'G5', 'B5', 'E6'] },
  { bass: ['C3', 'G3'], arp: ['C5', 'E5', 'G5', 'C6'] },
]

function transposeProgression(progression, semitones) {
  return progression.map((chord) => ({
    bass: chord.bass.map((n) => transposeNote(n, semitones)),
    arp: chord.arp.map((n) => transposeNote(n, semitones)),
  }))
}

function scheduleProgression({ startTime, progression, repeats, chordDuration, events }) {
  let t = startTime
  for (let rep = 0; rep < repeats; rep++) {
    const ascending = rep % 2 === 0
    for (const chord of progression) {
      const bassNoteDur = chordDuration / 2
      events.bass.push({ time: t, note: chord.bass[0], duration: bassNoteDur })
      events.bass.push({ time: t + bassNoteDur, note: chord.bass[1], duration: bassNoteDur })

      const arp = ascending ? chord.arp : [...chord.arp].reverse()
      const noteDur = chordDuration / arp.length
      arp.forEach((note, i) => {
        events.melody.push({ time: t + i * noteDur, note, duration: noteDur })
      })

      t += chordDuration
    }
  }
  return t
}

function generateSong({ transpose, dutyMelody, dutyBass, chordDuration, sampleRate }) {
  const progressionI = transposeProgression(BASE_PROGRESSION_I, transpose)
  const progressionII = transposeProgression(BASE_PROGRESSION_II, transpose)

  const events = { melody: [], bass: [], perc: [] }
  let t = 0
  t = scheduleProgression({ startTime: t, progression: progressionI, repeats: 3, chordDuration, events })
  t = scheduleProgression({ startTime: t, progression: progressionII, repeats: 2, chordDuration, events })
  t = scheduleProgression({ startTime: t, progression: progressionI, repeats: 2, chordDuration, events })

  const outroNotes = [
    transposeNote('C5', transpose),
    transposeNote('E5', transpose),
    transposeNote('G5', transpose),
    transposeNote('C6', transpose),
    transposeNote('E6', transpose),
  ]
  const outroStep = 0.15
  outroNotes.forEach((note, i) => {
    const isLast = i === outroNotes.length - 1
    events.melody.push({ time: t + i * outroStep, note, duration: isLast ? 1.0 : outroStep })
  })
  events.bass.push({
    time: t,
    note: transposeNote('C3', transpose),
    duration: outroStep * (outroNotes.length - 1) + 1.0,
  })
  t += outroStep * (outroNotes.length - 1) + 1.0

  const totalDuration = t
  for (let i = 0; i * 0.2 < totalDuration; i++) {
    if (i % 2 === 1) events.perc.push({ time: i * 0.2, duration: 0.05 })
  }

  const totalSamples = Math.round(totalDuration * sampleRate)

  function renderNotes(noteEvents, dutyCycle, volume) {
    const buffer = new Float32Array(totalSamples)
    for (const e of noteEvents) {
      const wave = squareWave(noteFreq(e.note), e.duration, dutyCycle, volume, sampleRate)
      applyEnvelope(wave, 4, Math.min(20, e.duration * 1000 * 0.3), sampleRate)
      mixInto(buffer, wave, Math.round(e.time * sampleRate))
    }
    return buffer
  }

  function renderPercussion(percEvents, volume) {
    const buffer = new Float32Array(totalSamples)
    for (const e of percEvents) {
      const wave = noiseBurst(e.duration, volume, sampleRate)
      applyEnvelope(wave, 1, e.duration * 1000 * 0.8, sampleRate)
      mixInto(buffer, wave, Math.round(e.time * sampleRate))
    }
    return buffer
  }

  const melodySamples = renderNotes(events.melody, dutyMelody, 0.22)
  const bassSamples = renderNotes(events.bass, dutyBass, 0.16)
  const percSamples = renderPercussion(events.perc, 0.07)

  const mixed = new Float32Array(totalSamples)
  for (let i = 0; i < totalSamples; i++) {
    mixed[i] = melodySamples[i] + bassSamples[i] + percSamples[i]
  }

  let peak = 0
  for (let i = 0; i < mixed.length; i++) peak = Math.max(peak, Math.abs(mixed[i]))
  const norm = peak > 0 ? Math.min(1, 0.9 / peak) : 1

  const pcm = new Int16Array(mixed.length)
  for (let i = 0; i < mixed.length; i++) {
    pcm[i] = Math.max(-32768, Math.min(32767, Math.round(mixed[i] * norm * 32767)))
  }

  return { pcm, duration: totalDuration }
}

function writeWavFile(filePath, pcmData, sampleRate) {
  const numChannels = 1
  const bitsPerSample = 16
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
  const blockAlign = (numChannels * bitsPerSample) / 8
  const dataSize = pcmData.length * 2

  const buffer = Buffer.alloc(44 + dataSize)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(numChannels, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(byteRate, 28)
  buffer.writeUInt16LE(blockAlign, 32)
  buffer.writeUInt16LE(bitsPerSample, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)

  for (let i = 0; i < pcmData.length; i++) {
    buffer.writeInt16LE(pcmData[i], 44 + i * 2)
  }

  fs.writeFileSync(filePath, buffer)
}

const TRANSPOSES = [0, 2, 4, 5, 7]
const TIMBRES = [
  { dutyMelody: 0.25, dutyBass: 0.5, chordDuration: 1.6 },
  { dutyMelody: 0.125, dutyBass: 0.5, chordDuration: 1.3 },
  { dutyMelody: 0.5, dutyBass: 0.25, chordDuration: 2.0 },
]

const outDir = path.join(__dirname, '..', 'assets', 'audio')
fs.mkdirSync(outDir, { recursive: true })

let trackNumber = 1
for (const transpose of TRANSPOSES) {
  for (const timbre of TIMBRES) {
    const { pcm, duration } = generateSong({ transpose, sampleRate: SAMPLE_RATE, ...timbre })
    const fileName = `theme-${String(trackNumber).padStart(2, '0')}.wav`
    const outPath = path.join(outDir, fileName)
    writeWavFile(outPath, pcm, SAMPLE_RATE)
    console.log(`Wrote ${fileName} (${duration.toFixed(1)}s)`)
    trackNumber++
  }
}
