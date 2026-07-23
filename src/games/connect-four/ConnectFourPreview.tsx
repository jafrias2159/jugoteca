import { View } from 'react-native'

const SAMPLE: ReadonlyArray<ReadonlyArray<'R' | 'Y' | null>> = [
  [null, null, 'Y', 'R', 'Y', null, null],
  [null, 'R', 'R', 'Y', 'R', null, null],
  ['Y', 'Y', 'R', 'Y', 'Y', 'R', null],
]

export default function ConnectFourPreview() {
  return (
    <View className="gap-1 rounded-lg bg-blue-900 p-1.5">
      {SAMPLE.map((row, r) => (
        <View key={r} className="flex-row gap-1">
          {row.map((cell, c) => (
            <View key={c} className="h-4 w-4 items-center justify-center rounded-full bg-slate-950">
              {cell && (
                <View className={`h-3 w-3 rounded-full ${cell === 'R' ? 'bg-red-500' : 'bg-yellow-400'}`} />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
