import { games } from '../data/games'
import GameCard from '../components/GameCard'

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-100">🧃 Jugoteca</h1>
        <p className="mt-2 text-slate-400">Tu hub de juegos web. Elige una ventana para jugar.</p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
