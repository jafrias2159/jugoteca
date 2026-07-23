import { Text, View } from 'react-native'

const LETTERS = ['S', 'O', 'L', 'K', 'M', 'A', 'R', 'X', 'B', 'C', 'D', 'E']
const HIGHLIGHTED = new Set([0, 1, 2, 5, 6])

export default function WordSearchPreview() {
  return (
    <View className="w-36 flex-row flex-wrap gap-1">
      {LETTERS.map((letter, i) => (
        <View
          key={i}
          className={`h-8 w-8 items-center justify-center rounded-sm ${
            HIGHLIGHTED.has(i) ? 'bg-emerald-700' : 'bg-slate-700'
          }`}
        >
          <Text className="text-xs font-bold text-slate-100">{letter}</Text>
        </View>
      ))}
    </View>
  )
}
