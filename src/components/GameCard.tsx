import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import type { GameDef } from '../data/games'
import WindowFrame from './WindowFrame'

export default function GameCard({ game }: { game: GameDef }) {
  return (
    <Link href={`/juego/${game.id}`} asChild>
      <Pressable className="active:opacity-80">
        <WindowFrame title={game.title}>
          <View className="h-32 items-center justify-center gap-2">
            <Text className="text-5xl">{game.emoji}</Text>
            <Text className="text-center text-sm text-slate-400">{game.description}</Text>
          </View>
        </WindowFrame>
      </Pressable>
    </Link>
  )
}
