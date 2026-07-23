import { Text, View } from 'react-native'

export default function RockPaperScissorsPreview() {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-4xl">🪨</Text>
      <Text className="text-sm text-slate-500">vs</Text>
      <Text className="text-4xl">✂️</Text>
    </View>
  )
}
