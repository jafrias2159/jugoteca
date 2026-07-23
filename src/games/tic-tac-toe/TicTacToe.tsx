import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

type Cell = 'X' | 'O' | null

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function calculateWinner(board: Cell[]): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const winner = calculateWinner(board)
  const isDraw = !winner && board.every((cell) => cell !== null)

  function handleClick(index: number) {
    if (board[index] || winner) return
    const next = [...board]
    next[index] = xIsNext ? 'X' : 'O'
    setBoard(next)
    setXIsNext(!xIsNext)
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }

  let status: string
  if (winner) status = `¡Gana ${winner}!`
  else if (isDraw) status = 'Empate'
  else status = `Turno de ${xIsNext ? 'X' : 'O'}`

  return (
    <View className="items-center gap-4">
      <Text className="text-lg font-medium text-slate-200">{status}</Text>
      <View className="w-60 flex-row flex-wrap gap-2">
        {board.map((cell, i) => (
          <Pressable
            key={i}
            onPress={() => handleClick(i)}
            disabled={!!cell || !!winner}
            className="h-[72px] w-[72px] items-center justify-center rounded-lg bg-slate-800 active:bg-slate-700"
          >
            <Text className="text-3xl font-bold text-slate-100">{cell}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={reset}
        className="rounded-lg bg-indigo-600 px-4 py-2 active:bg-indigo-500"
      >
        <Text className="text-sm font-medium text-white">Reiniciar</Text>
      </Pressable>
    </View>
  )
}
