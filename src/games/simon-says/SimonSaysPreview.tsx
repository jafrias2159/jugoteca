import { View } from 'react-native'

export default function SimonSaysPreview() {
  return (
    <View className="w-24 flex-row flex-wrap gap-1.5">
      <View className="h-11 w-11 rounded-lg bg-red-300" />
      <View className="h-11 w-11 rounded-lg bg-blue-500" />
      <View className="h-11 w-11 rounded-lg bg-emerald-500" />
      <View className="h-11 w-11 rounded-lg bg-yellow-400" />
    </View>
  )
}
