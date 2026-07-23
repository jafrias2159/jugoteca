import { Link, Navigate, useParams } from 'react-router-dom'
import { games } from '../data/games'
import WindowFrame from '../components/WindowFrame'

export default function GamePage() {
  const { gameId } = useParams()
  const game = games.find((g) => g.id === gameId)

  if (!game) return <Navigate to="/" replace />

  const GameComponent = game.component

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/" className="mb-6 inline-block text-sm text-slate-400 hover:text-slate-200">
        ← Volver al catálogo
      </Link>
      <WindowFrame title={game.title}>
        <GameComponent />
      </WindowFrame>
    </div>
  )
}
