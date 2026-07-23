import { useCallback, useEffect, useRef, useState } from 'react'
import { PanResponder, Platform, Pressable, Text, View } from 'react-native'

const SIZE = 4

type Board = number[][]
type Direction = 'left' | 'right' | 'up' | 'down'

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

function emptyCells(board: Board): Array<[number, number]> {
  const cells: Array<[number, number]> = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) cells.push([r, c])
    }
  }
  return cells
}

function spawnTile(board: Board): Board {
  const cells = emptyCells(board)
  if (cells.length === 0) return board
  const [r, c] = cells[Math.floor(Math.random() * cells.length)]
  const next = board.map((row) => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

function initBoard(): Board {
  return spawnTile(spawnTile(emptyBoard()))
}

function slideRowLeft(row: number[]) {
  const nonZero = row.filter((v) => v !== 0)
  const merged: number[] = []
  let scoreGained = 0
  for (let i = 0; i < nonZero.length; i++) {
    if (nonZero[i] === nonZero[i + 1]) {
      const value = nonZero[i] * 2
      merged.push(value)
      scoreGained += value
      i++
    } else {
      merged.push(nonZero[i])
    }
  }
  while (merged.length < row.length) merged.push(0)
  return { row: merged, scoreGained }
}

function transpose(board: Board): Board {
  return board[0].map((_, c) => board.map((row) => row[c]))
}

function reverseRows(board: Board): Board {
  return board.map((row) => [...row].reverse())
}

function moveBoard(board: Board, direction: Direction) {
  let working = board.map((row) => [...row])
  if (direction === 'up' || direction === 'down') working = transpose(working)
  if (direction === 'right' || direction === 'down') working = reverseRows(working)

  let scoreGained = 0
  working = working.map((row) => {
    const result = slideRowLeft(row)
    scoreGained += result.scoreGained
    return result.row
  })

  if (direction === 'right' || direction === 'down') working = reverseRows(working)
  if (direction === 'up' || direction === 'down') working = transpose(working)

  const moved = working.some((row, r) => row.some((cell, c) => cell !== board[r][c]))
  return { board: working, scoreGained, moved }
}

function canMove(board: Board): boolean {
  if (emptyCells(board).length > 0) return true
  return (['left', 'right', 'up', 'down'] as Direction[]).some((dir) => moveBoard(board, dir).moved)
}

const TILE_COLORS: Record<number, string> = {
  2: 'bg-amber-100',
  4: 'bg-amber-200',
  8: 'bg-orange-300',
  16: 'bg-orange-400',
  32: 'bg-orange-500',
  64: 'bg-red-400',
  128: 'bg-yellow-300',
  256: 'bg-yellow-400',
  512: 'bg-yellow-500',
  1024: 'bg-yellow-600',
  2048: 'bg-yellow-700',
}

function tileColor(value: number) {
  return TILE_COLORS[value] ?? 'bg-purple-600'
}

export default function Game2048() {
  const [board, setBoard] = useState<Board>(initBoard)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const applyMove = useCallback(
    (direction: Direction) => {
      if (gameOver) return
      setBoard((prev) => {
        const result = moveBoard(prev, direction)
        if (!result.moved) return prev
        setScore((s) => s + result.scoreGained)
        const next = spawnTile(result.board)
        if (next.some((row) => row.some((cell) => cell === 2048))) setWon(true)
        if (!canMove(next)) setGameOver(true)
        return next
      })
    },
    [gameOver],
  )

  useEffect(() => {
    if (Platform.OS !== 'web') return
    function handleKey(e: KeyboardEvent) {
      const map: Record<string, Direction> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      }
      const direction = map[e.key]
      if (direction) {
        e.preventDefault()
        applyMove(direction)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [applyMove])

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > 15 || Math.abs(gesture.dy) > 15,
      onPanResponderRelease: (_, gesture) => {
        const { dx, dy } = gesture
        if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return
        if (Math.abs(dx) > Math.abs(dy)) {
          applyMove(dx > 0 ? 'right' : 'left')
        } else {
          applyMove(dy > 0 ? 'down' : 'up')
        }
      },
    }),
  ).current

  function reset() {
    setBoard(initBoard())
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  return (
    <View className="items-center gap-4">
      <Text className="text-lg font-medium text-slate-200">Puntos: {score}</Text>
      {won && <Text className="text-sm text-emerald-400">¡Llegaste a 2048!</Text>}
      {gameOver && <Text className="text-sm text-red-400">Sin movimientos, juego terminado</Text>}
      <View {...panResponder.panHandlers} className="gap-1.5 rounded-lg bg-slate-800 p-1.5">
        {board.map((row, r) => (
          <View key={r} className="flex-row gap-1.5">
            {row.map((value, c) => (
              <View
                key={c}
                className={`h-14 w-14 items-center justify-center rounded-md ${
                  value ? tileColor(value) : 'bg-slate-700'
                }`}
              >
                {value > 0 && (
                  <Text
                    className={`text-base font-bold ${value <= 4 ? 'text-slate-800' : 'text-white'}`}
                  >
                    {value}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
      <Text className="text-xs text-slate-500">
        {Platform.OS === 'web' ? 'Usa las flechas del teclado' : 'Desliza para mover las fichas'}
      </Text>
      <Pressable onPress={reset} className="rounded-lg bg-indigo-600 px-4 py-2 active:bg-indigo-500">
        <Text className="text-sm font-medium text-white">Reiniciar</Text>
      </Pressable>
    </View>
  )
}
