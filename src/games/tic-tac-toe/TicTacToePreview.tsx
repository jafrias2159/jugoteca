import { Text, View } from 'react-native'

const SAMPLE_BOARD = ['X', 'O', 'X', null, 'X', 'O', 'O', null, null] as const

export default function TicTacToePreview() {
  return (
    <View className="w-28 flex-row flex-wrap gap-1">
      {SAMPLE_BOARD.map((cell, i) => (
        <View key={i} className="h-8 w-8 items-center justify-center rounded-md bg-slate-800">
          <Text className="text-sm font-bold text-slate-100">{cell}</Text>
        </View>
      ))}
    </View>
  )
}
