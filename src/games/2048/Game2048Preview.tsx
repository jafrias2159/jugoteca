import { Text, View } from 'react-native'

const SAMPLE = [2, 4, 8, 16, 32, 4, 2, 128, 8]

const TILE_COLORS: Record<number, string> = {
  2: 'bg-amber-100',
  4: 'bg-amber-200',
  8: 'bg-orange-300',
  16: 'bg-orange-400',
  32: 'bg-orange-500',
  128: 'bg-yellow-300',
}

export default function Game2048Preview() {
  return (
    <View className="w-32 flex-row flex-wrap gap-1">
      {SAMPLE.map((value, i) => (
        <View
          key={i}
          className={`h-10 w-10 items-center justify-center rounded-md ${
            TILE_COLORS[value] ?? 'bg-slate-700'
          }`}
        >
          <Text className={`text-xs font-bold ${value <= 4 ? 'text-slate-800' : 'text-white'}`}>
            {value}
          </Text>
        </View>
      ))}
    </View>
  )
}
