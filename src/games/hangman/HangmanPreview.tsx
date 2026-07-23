import { Text, View } from 'react-native'

const SAMPLE = ['R', '', 'A', 'C', '', ''] as const

export default function HangmanPreview() {
  return (
    <View className="items-center gap-2">
      <View className="flex-row gap-1.5">
        {SAMPLE.map((letter, i) => (
          <View key={i} className="h-8 w-6 items-center justify-center border-b-2 border-slate-500">
            <Text className="text-sm font-bold text-slate-100">{letter}</Text>
          </View>
        ))}
      </View>
      <Text className="text-xs text-slate-500">Errores: 2 / 6</Text>
    </View>
  )
}
