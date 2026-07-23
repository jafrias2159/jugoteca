import type { ComponentType } from 'react'
import TicTacToe from '../games/tic-tac-toe/TicTacToe'
import TicTacToePreview from '../games/tic-tac-toe/TicTacToePreview'
import Memory from '../games/memory/Memory'
import MemoryPreview from '../games/memory/MemoryPreview'
import ConnectFour from '../games/connect-four/ConnectFour'
import ConnectFourPreview from '../games/connect-four/ConnectFourPreview'
import Minesweeper from '../games/minesweeper/Minesweeper'
import MinesweeperPreview from '../games/minesweeper/MinesweeperPreview'
import Game2048 from '../games/2048/Game2048'
import Game2048Preview from '../games/2048/Game2048Preview'
import Hangman from '../games/hangman/Hangman'
import HangmanPreview from '../games/hangman/HangmanPreview'
import SimonSays from '../games/simon-says/SimonSays'
import SimonSaysPreview from '../games/simon-says/SimonSaysPreview'
import RockPaperScissors from '../games/rock-paper-scissors/RockPaperScissors'
import RockPaperScissorsPreview from '../games/rock-paper-scissors/RockPaperScissorsPreview'
import WordSearch from '../games/word-search/WordSearch'
import WordSearchPreview from '../games/word-search/WordSearchPreview'
import Snake from '../games/snake/Snake'
import SnakePreview from '../games/snake/SnakePreview'

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
  {
    id: 'connect-four',
    title: 'Conecta 4',
    description: 'Conecta 4 fichas en línea antes que tu rival.',
    preview: ConnectFourPreview,
    component: ConnectFour,
  },
  {
    id: 'minesweeper',
    title: 'Buscaminas',
    description: 'Revela el tablero sin pisar una mina.',
    preview: MinesweeperPreview,
    component: Minesweeper,
  },
  {
    id: '2048',
    title: '2048',
    description: 'Une números iguales hasta llegar al 2048.',
    preview: Game2048Preview,
    component: Game2048,
  },
  {
    id: 'hangman',
    title: 'Ahorcado',
    description: 'Adivina la palabra letra por letra.',
    preview: HangmanPreview,
    component: Hangman,
  },
  {
    id: 'simon-says',
    title: 'Simon Dice',
    description: 'Repite la secuencia de colores de memoria.',
    preview: SimonSaysPreview,
    component: SimonSays,
  },
  {
    id: 'rock-paper-scissors',
    title: 'Piedra, Papel o Tijera',
    description: 'Vence a la máquina en el clásico de siempre.',
    preview: RockPaperScissorsPreview,
    component: RockPaperScissors,
  },
  {
    id: 'word-search',
    title: 'Sopa de Letras',
    description: 'Encuentra las palabras escondidas en la grilla.',
    preview: WordSearchPreview,
    component: WordSearch,
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Come y crece sin chocar contra ti mismo.',
    preview: SnakePreview,
    component: Snake,
  },
]
