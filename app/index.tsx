import GameCard from '@/components/GameCard'
import { games } from '@/data/games'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CatalogScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-3xl px-6 pt-12"
        contentContainerStyle={{ paddingBottom: 48 + insets.bottom }}
      >
        <View className="mb-10 items-center gap-2">
          <Text className="text-4xl font-bold text-slate-100">🧃 Jugoteca</Text>
          <Text className="text-center text-slate-400">
            Tu hub de juegos web. Elige una ventana para jugar.
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-6">
          {games.map((game) => (
            <View key={game.id} className="w-full sm:w-[47%] lg:w-[31%]">
              <GameCard game={game} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
