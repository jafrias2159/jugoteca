import { useState } from 'react'

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
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-medium text-slate-200">{status}</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner}
            className="flex h-20 w-20 items-center justify-center rounded-lg bg-slate-800 text-3xl font-bold text-slate-100 transition hover:bg-slate-700 disabled:cursor-default"
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Reiniciar
      </button>
    </div>
  )
}
