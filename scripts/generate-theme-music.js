const fs = require('fs')
const path = require('path')

const SAMPLE_RATE = 22050

const NOTE_INDEX = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }

function noteFreq(note) {
  const [, letter, octaveStr] = note.match(/^([A-G]#?)(\d)$/)
  const octave = Number(octaveStr)
  const semitonesFromA4 = (octave - 4) * 12 + (NOTE_INDEX[letter] - 9)
  return 440 * Math.pow(2, semitonesFromA4 / 12)
}

function squareWave(freq, duration, dutyCycle, volume) {
  const samples = Math.round(SAMPLE_RATE * duration)
  const period = SAMPLE_RATE / freq
  const out = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const phase = (i % period) / period
    out[i] = (phase < dutyCycle ? 1 : -1) * volume
  }
  return out
}

function noiseBurst(duration, volume) {
  const samples = Math.round(SAMPLE_RATE * duration)
  const out = new Float32Array(samples)
  for (let i = 0; i < samples; i++) out[i] = (Math.random() * 2 - 1) * volume
  return out
}

function applyEnvelope(samples, attackMs, releaseMs) {
  const attack = Math.round((attackMs / 1000) * SAMPLE_RATE)
  const release = Math.round((releaseMs / 1000) * SAMPLE_RATE)
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

// --- Composition ---
// Two keys (C major / G major) give the "modulation lift" that makes a chiptune
// loop feel upbeat instead of a robotic repeat. C and G chords are shared
// between both progressions so the transitions land smoothly.

const PROGRESSION_C_MAJOR = [
  { bass: ['C3', 'G3'], arp: ['C5', 'E5', 'G5', 'C6'] },
  { bass: ['G3', 'D4'], arp: ['G4', 'B4', 'D5', 'G5'] },
  { bass: ['A3', 'E4'], arp: ['A4', 'C5', 'E5', 'A5'] },
  { bass: ['F3', 'C4'], arp: ['F4', 'A4', 'C5', 'F5'] },
]

const PROGRESSION_G_MAJOR = [
  { bass: ['G3', 'D4'], arp: ['B4', 'D5', 'G5', 'B5'] },
  { bass: ['D3', 'A3'], arp: ['D5', 'F#5', 'A5', 'D6'] },
  { bass: ['E3', 'B3'], arp: ['E5', 'G5', 'B5', 'E6'] },
  { bass: ['C3', 'G3'], arp: ['C5', 'E5', 'G5', 'C6'] },
]

const CHORD_DURATION = 1.6

function scheduleProgression({ startTime, progression, repeats, events }) {
  let t = startTime
  for (let rep = 0; rep < repeats; rep++) {
    const ascending = rep % 2 === 0
    for (const chord of progression) {
      const bassNoteDur = CHORD_DURATION / 2
      events.bass.push({ time: t, note: chord.bass[0], duration: bassNoteDur })
      events.bass.push({ time: t + bassNoteDur, note: chord.bass[1], duration: bassNoteDur })

      const arp = ascending ? chord.arp : [...chord.arp].reverse()
      const noteDur = CHORD_DURATION / arp.length
      arp.forEach((note, i) => {
        events.melody.push({ time: t + i * noteDur, note, duration: noteDur })
      })

      t += CHORD_DURATION
    }
  }
  return t
}

const events = { melody: [], bass: [], perc: [] }

let t = 0
t = scheduleProgression({ startTime: t, progression: PROGRESSION_C_MAJOR, repeats: 6, events })
t = scheduleProgression({ startTime: t, progression: PROGRESSION_G_MAJOR, repeats: 6, events })
t = scheduleProgression({ startTime: t, progression: PROGRESSION_C_MAJOR, repeats: 6, events })

// Outro flourish: quick ascending run landing on a held tonic.
const outroNotes = ['C5', 'E5', 'G5', 'C6', 'E6']
const outroStep = 0.15
outroNotes.forEach((note, i) => {
  const isLast = i === outroNotes.length - 1
  events.melody.push({ time: t + i * outroStep, note, duration: isLast ? 1.0 : outroStep })
})
events.bass.push({ time: t, note: 'C3', duration: outroStep * (outroNotes.length - 1) + 1.0 })
t += outroStep * (outroNotes.length - 1) + 1.0

const totalDuration = t
for (let i = 0; i * 0.2 < totalDuration; i++) {
  if (i % 2 === 1) events.perc.push({ time: i * 0.2, duration: 0.05 })
}

const totalSamples = Math.round(totalDuration * SAMPLE_RATE)

function renderNotes(noteEvents, dutyCycle, volume) {
  const buffer = new Float32Array(totalSamples)
  for (const e of noteEvents) {
    const wave = squareWave(noteFreq(e.note), e.duration, dutyCycle, volume)
    applyEnvelope(wave, 4, Math.min(20, e.duration * 1000 * 0.3))
    mixInto(buffer, wave, Math.round(e.time * SAMPLE_RATE))
  }
  return buffer
}

function renderPercussion(percEvents, volume) {
  const buffer = new Float32Array(totalSamples)
  for (const e of percEvents) {
    const wave = noiseBurst(e.duration, volume)
    applyEnvelope(wave, 1, e.duration * 1000 * 0.8)
    mixInto(buffer, wave, Math.round(e.time * SAMPLE_RATE))
  }
  return buffer
}

const melodySamples = renderNotes(events.melody, 0.25, 0.22)
const bassSamples = renderNotes(events.bass, 0.5, 0.16)
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

const outDir = path.join(__dirname, '..', 'assets', 'audio')
fs.mkdirSync(outDir, { recursive: true })
const outPath = path.join(outDir, 'theme.wav')
writeWavFile(outPath, pcm, SAMPLE_RATE)
console.log(`Wrote ${outPath} (${(pcm.length / SAMPLE_RATE).toFixed(1)}s)`)
