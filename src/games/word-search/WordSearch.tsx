import { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const SIZE = 8
const WORDS = ['SOL', 'MAR', 'LUNA', 'RIO', 'ESTRELLA']
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

type Direction = 'H' | 'V'

interface Placement {
  word: string
  row: number
  col: number
  direction: Direction
}

function cellKey(row: number, col: number) {
  return `${row}-${col}`
}

function placementCells(p: Placement): string[] {
  const cells: string[] = []
  for (let i = 0; i < p.word.length; i++) {
    const r = p.direction === 'V' ? p.row + i : p.row
    const c = p.direction === 'H' ? p.col + i : p.col
    cells.push(cellKey(r, c))
  }
  return cells
}

function generatePuzzle(): { grid: string[][]; placements: Placement[] } {
  for (let attempt = 0; attempt < 200; attempt++) {
    const grid: (string | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
    const placements: Placement[] = []
    let success = true

    for (const word of WORDS) {
      let placed = false
      for (let tries = 0; tries < 50 && !placed; tries++) {
        const direction: Direction = Math.random() < 0.5 ? 'H' : 'V'
        const maxRow = direction === 'V' ? SIZE - word.length : SIZE - 1
        const maxCol = direction === 'H' ? SIZE - word.length : SIZE - 1
        const row = Math.floor(Math.random() * (maxRow + 1))
        const col = Math.floor(Math.random() * (maxCol + 1))

        let fits = true
        for (let i = 0; i < word.length; i++) {
          const r = direction === 'V' ? row + i : row
          const c = direction === 'H' ? col + i : col
          const existing = grid[r][c]
          if (existing && existing !== word[i]) {
            fits = false
            break
          }
        }

        if (fits) {
          for (let i = 0; i < word.length; i++) {
            const r = direction === 'V' ? row + i : row
            const c = direction === 'H' ? col + i : col
            grid[r][c] = word[i]
          }
          placements.push({ word, row, col, direction })
          placed = true
        }
      }
      if (!placed) {
        success = false
        break
      }
    }

    if (success) {
      const finalGrid = grid.map((row) =>
        row.map((cell) => cell ?? LETTERS[Math.floor(Math.random() * LETTERS.length)]),
      )
      return { grid: finalGrid, placements }
    }
  }
  throw new Error('No se pudo generar la sopa de letras')
}

export default function WordSearch() {
  const [game, setGame] = useState(generatePuzzle)
  const [start, setStart] = useState<[number, number] | null>(null)
  const [found, setFound] = useState<Set<string>>(new Set())

  const { grid, placements } = game
  const isWon = found.size === placements.length

  const foundCellKeys = useMemo(() => {
    const set = new Set<string>()
    placements.forEach((p) => {
      if (found.has(p.word)) placementCells(p).forEach((k) => set.add(k))
    })
    return set
  }, [found, placements])

  function handlePress(r: number, c: number) {
    if (!start) {
      setStart([r, c])
      return
    }

    const [sr, sc] = start
    if (sr === r && sc === c) {
      setStart(null)
      return
    }
    if (sr !== r && sc !== c) {
      setStart([r, c])
      return
    }

    const cellsBetween: Array<[number, number]> = []
    if (sr === r) {
      const [from, to] = sc < c ? [sc, c] : [c, sc]
      for (let cc = from; cc <= to; cc++) cellsBetween.push([r, cc])
    } else {
      const [from, to] = sr < r ? [sr, r] : [r, sr]
      for (let rr = from; rr <= to; rr++) cellsBetween.push([rr, sc])
    }

    const selectedWord = cellsBetween.map(([rr, cc]) => grid[rr][cc]).join('')
    const reversed = selectedWord.split('').reverse().join('')

    const match = placements.find(
      (p) => !found.has(p.word) && (p.word === selectedWord || p.word === reversed),
    )

    if (match) setFound((prev) => new Set(prev).add(match.word))
    setStart(null)
  }

  function reset() {
    setGame(generatePuzzle())
    setStart(null)
    setFound(new Set())
  }

  return (
    <View className="items-center gap-4">
      <Text className="text-sm text-slate-400">
        Encontradas: {found.size} / {placements.length}
      </Text>
      {isWon && <Text className="text-sm text-emerald-400">¡Encontraste todas las palabras!</Text>}
      <View className="flex-row flex-wrap justify-center gap-2 px-2">
        {placements.map((p) => (
          <Text
            key={p.word}
            className={`text-xs font-medium ${
              found.has(p.word) ? 'text-emerald-400 line-through' : 'text-slate-400'
            }`}
          >
            {p.word}
          </Text>
        ))}
      </View>
      <View className="gap-0.5 rounded-lg bg-slate-800 p-1">
        {grid.map((row, r) => (
          <View key={r} className="flex-row gap-0.5">
            {row.map((letter, c) => {
              const key = cellKey(r, c)
              const isFound = foundCellKeys.has(key)
              const isStart = start?.[0] === r && start?.[1] === c
              return (
                <Pressable
                  key={c}
                  onPress={() => handlePress(r, c)}
                  className={`h-8 w-8 items-center justify-center rounded-sm ${
                    isFound
                      ? 'bg-emerald-700'
                      : isStart
                        ? 'bg-indigo-600'
                        : 'bg-slate-700 active:bg-slate-600'
                  }`}
                >
                  <Text className="text-xs font-bold text-slate-100">{letter}</Text>
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>
      <Pressable onPress={reset} className="rounded-lg bg-indigo-600 px-4 py-2 active:bg-indigo-500">
        <Text className="text-sm font-medium text-white">Nueva sopa</Text>
      </Pressable>
    </View>
  )
}
