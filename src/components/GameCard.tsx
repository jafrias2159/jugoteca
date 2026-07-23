import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import type { GameDef } from '../data/games'
import WindowFrame from './WindowFrame'

export default function GameCard({ game }: { game: GameDef }) {
  const Preview = game.preview

  return (
    <Link href={`/juego/${game.id}`} asChild>
      <Pressable className="active:opacity-80">
        <WindowFrame title={game.title}>
          <View className="h-36 items-center justify-center gap-3">
            <Preview />
            <Text className="text-center text-sm text-slate-400">{game.description}</Text>
          </View>
        </WindowFrame>
      </Pressable>
    </Link>
  )
}
