import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

type Player = 'R' | 'Y'
type Cell = Player | null

const ROWS = 6
const COLS = 7

function createBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null))
}

function checkWinner(board: Cell[][]): Player | null {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const player = board[r][c]
      if (!player) continue
      for (const [dr, dc] of dirs) {
        let count = 1
        for (let step = 1; step < 4; step++) {
          const nr = r + dr * step
          const nc = c + dc * step
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break
          count++
        }
        if (count === 4) return player
      }
    }
  }
  return null
}

export default function ConnectFour() {
  const [board, setBoard] = useState<Cell[][]>(createBoard)
  const [isRedNext, setIsRedNext] = useState(true)

  const winner = checkWinner(board)
  const isDraw = !winner && board.every((row) => row.every((cell) => cell !== null))

  function handleDrop(col: number) {
    if (winner || isDraw) return
    const rowFromBottom = [...board].reverse().findIndex((row) => row[col] === null)
    if (rowFromBottom === -1) return
    const targetRow = ROWS - 1 - rowFromBottom
    const next = board.map((row) => [...row])
    next[targetRow][col] = isRedNext ? 'R' : 'Y'
    setBoard(next)
    setIsRedNext(!isRedNext)
  }

  function reset() {
    setBoard(createBoard())
    setIsRedNext(true)
  }

  let status: string
  if (winner) status = `¡Gana ${winner === 'R' ? 'Rojo' : 'Amarillo'}!`
  else if (isDraw) status = 'Empate'
  else status = `Turno: ${isRedNext ? 'Rojo' : 'Amarillo'}`

  return (
    <View className="items-center gap-4">
      <Text className="text-lg font-medium text-slate-200">{status}</Text>
      <View className="gap-1 rounded-lg bg-blue-900 p-2">
        {board.map((row, r) => (
          <View key={r} className="flex-row gap-1">
            {row.map((cell, c) => (
              <Pressable
                key={c}
                onPress={() => handleDrop(c)}
                disabled={!!winner || isDraw}
                className="h-8 w-8 items-center justify-center rounded-full bg-slate-950"
              >
                {cell && (
                  <View
                    className={`h-6 w-6 rounded-full ${cell === 'R' ? 'bg-red-500' : 'bg-yellow-400'}`}
                  />
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
