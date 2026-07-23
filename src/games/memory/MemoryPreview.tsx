import { Text, View } from 'react-native'

const SAMPLE_CARDS = ['🍎', null, null, '🍇', null, '🍒', null, null] as const

export default function MemoryPreview() {
  return (
    <View className="w-36 flex-row flex-wrap gap-1">
      {SAMPLE_CARDS.map((emoji, i) => (
        <View
          key={i}
          className={`h-8 w-8 items-center justify-center rounded-md ${
            emoji ? 'bg-slate-700' : 'bg-slate-800'
          }`}
        >
          <Text className="text-sm">{emoji ?? ''}</Text>
        </View>
      ))}
    </View>
  )
}
