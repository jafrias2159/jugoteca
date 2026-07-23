import { Link } from 'react-router-dom'
import type { GameDef } from '../data/games'
import WindowFrame from './WindowFrame'

export default function GameCard({ game }: { game: GameDef }) {
  return (
    <Link
      to={`/juego/${game.id}`}
      className="group block transition-transform hover:-translate-y-1"
    >
      <WindowFrame title={game.title}>
        <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
          <span className="text-5xl">{game.emoji}</span>
          <p className="text-sm text-slate-400">{game.description}</p>
        </div>
      </WindowFrame>
    </Link>
  )
}
