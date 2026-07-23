import type { ComponentType } from 'react'
import TicTacToe from '../games/tic-tac-toe/TicTacToe'
import Memory from '../games/memory/Memory'

export interface GameDef {
  id: string
  title: string
  description: string
  emoji: string
  component: ComponentType
}

export const games: GameDef[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tres en Raya',
    description: 'El clásico de X y O para dos jugadores.',
    emoji: '⭕',
    component: TicTacToe,
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Encuentra todas las parejas de cartas.',
    emoji: '🧠',
    component: Memory,
  },
]
