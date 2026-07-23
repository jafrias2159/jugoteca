import WindowFrame from '@/components/WindowFrame'
import { games } from '@/data/games'
import { Link, Redirect, useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function generateStaticParams() {
  return games.map((game) => ({ gameId: game.id }))
}

export default function GameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>()
  const game = games.find((g) => g.id === gameId)
  const insets = useSafeAreaInsets()

  if (!game) return <Redirect href="/" />

  const GameComponent = game.component

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerClassName="mx-auto w-full max-w-xl px-6 pt-12"
      contentContainerStyle={{ paddingBottom: 48 + insets.bottom }}
    >
      <Link href="/" className="mb-6 text-sm text-slate-400">
        ← Volver al catálogo
      </Link>
      <WindowFrame title={game.title}>
        <GameComponent />
      </WindowFrame>
    </ScrollView>
  )
}
