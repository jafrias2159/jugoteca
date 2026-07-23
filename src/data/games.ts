import type { ComponentType } from 'react'
import TicTacToe from '../games/tic-tac-toe/TicTacToe'
import TicTacToePreview from '../games/tic-tac-toe/TicTacToePreview'
import Memory from '../games/memory/Memory'
import MemoryPreview from '../games/memory/MemoryPreview'

export interface GameDef {
  id: string
  title: string
  description: string
  preview: ComponentType
  component: ComponentType
}

export const games: GameDef[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tres en Raya',
    description: 'El clásico de X y O para dos jugadores.',
    preview: TicTacToePreview,
    component: TicTacToe,
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Encuentra todas las parejas de cartas.',
    preview: MemoryPreview,
    component: Memory,
  },
]
