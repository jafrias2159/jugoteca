import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const SIZE = 8
const MINES = 10

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacent: number
}

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacent: 0,
    })),
  )

  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE)
    const c = Math.floor(Math.random() * SIZE)
    if (!board[r][c].isMine) {
      board[r][c].isMine = true
      placed++
    }
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].isMine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].isMine) count++
        }
      }
      board[r][c].adjacent = count
    }
  }

  return board
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

function revealFrom(board: Cell[][], row: number, col: number) {
  const cell = board[row][col]
  if (cell.isRevealed || cell.isFlagged) return
  cell.isRevealed = true
  if (cell.adjacent === 0 && !cell.isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
          revealFrom(board, nr, nc)
        }
      }
    }
  }
}

const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-400',
  2: 'text-green-400',
  3: 'text-red-400',
  4: 'text-purple-400',
  5: 'text-amber-400',
  6: 'text-cyan-400',
  7: 'text-slate-300',
  8: 'text-slate-400',
}

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(createBoard)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  function reset() {
    setBoard(createBoard())
    setStatus('playing')
  }

  function handlePress(row: number, col: number) {
    if (status !== 'playing') return
    const cell = board[row][col]
    if (cell.isRevealed || cell.isFlagged) return

    const next = cloneBoard(board)
    if (cell.isMine) {
      for (const r of next) for (const c of r) if (c.isMine) c.isRevealed = true
      setBoard(next)
      setStatus('lost')
      return
    }

    revealFrom(next, row, col)
    setBoard(next)

    const won = next.every((r) => r.every((c) => c.isMine || c.isRevealed))
    if (won) setStatus('won')
  }

  function handleFlag(row: number, col: number) {
    if (status !== 'playing') return
    const cell = board[row][col]
    if (cell.isRevealed) return
    const next = cloneBoard(board)
    next[row][col].isFlagged = !next[row][col].isFlagged
    setBoard(next)
  }

  const message =
    status === 'won'
      ? '¡Ganaste!'
      : status === 'lost'
        ? '¡Boom! Perdiste'
        : 'Toca para revelar · mantén presionado para marcar'

  return (
    <View className="items-center gap-4">
      <Text className="text-center text-sm text-slate-300">{message}</Text>
      <View className="gap-0.5 rounded-lg bg-slate-800 p-1">
        {board.map((row, r) => (
          <View key={r} className="flex-row gap-0.5">
            {row.map((cell, c) => (
              <Pressable
                key={c}
                onPress={() => handlePress(r, c)}
                onLongPress={() => handleFlag(r, c)}
                className={`h-8 w-8 items-center justify-center rounded-sm ${
                  cell.isRevealed
                    ? cell.isMine
                      ? 'bg-red-600'
                      : 'bg-slate-700'
                    : 'bg-slate-600 active:bg-slate-500'
                }`}
              >
                {cell.isFlagged && !cell.isRevealed && <Text className="text-xs">🚩</Text>}
                {cell.isRevealed && cell.isMine && <Text className="text-xs">💣</Text>}
                {cell.isRevealed && !cell.isMine && cell.adjacent > 0 && (
                  <Text className={`text-xs font-bold ${NUMBER_COLORS[cell.adjacent]}`}>
                    {cell.adjacent}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
      <Pressable onPress={reset} className="rounded-lg bg-indigo-600 px-4 py-2 active:bg-indigo-500">
        <Text className="text-sm font-medium text-white">Reiniciar</Text>
      </Pressable>
    </View>
  )
}
