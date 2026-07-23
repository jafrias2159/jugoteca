import { View } from 'react-native'

const SIZE = 6
const SNAKE = new Set(['2-3', '3-3', '4-3', '4-2'])
const FOOD = '1-1'

export default function SnakePreview() {
  return (
    <View className="gap-0.5 rounded-md bg-slate-900 p-1">
      {Array.from({ length: SIZE }, (_, y) => (
        <View key={y} className="flex-row gap-0.5">
          {Array.from({ length: SIZE }, (_, x) => {
            const key = `${x}-${y}`
            return (
              <View
                key={x}
                className={`h-3.5 w-3.5 rounded-sm ${
                  key === FOOD ? 'bg-red-500' : SNAKE.has(key) ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            )
          })}
        </View>
      ))}
    </View>
  )
}
