import { Text, View } from 'react-native'

type Variant = 'hidden' | 'revealed' | 'flag' | 'mine'

const SAMPLE: ReadonlyArray<{ label: string; variant: Variant }> = [
  { label: '', variant: 'hidden' },
  { label: '1', variant: 'revealed' },
  { label: '', variant: 'flag' },
  { label: '2', variant: 'revealed' },
  { label: '', variant: 'hidden' },
  { label: '', variant: 'mine' },
  { label: '1', variant: 'revealed' },
  { label: '', variant: 'hidden' },
]

export default function MinesweeperPreview() {
  return (
    <View className="w-36 flex-row flex-wrap gap-1">
      {SAMPLE.map((cell, i) => (
        <View
          key={i}
          className={`h-8 w-8 items-center justify-center rounded-sm ${
            cell.variant === 'revealed'
              ? 'bg-slate-700'
              : cell.variant === 'mine'
                ? 'bg-red-600'
                : 'bg-slate-600'
          }`}
        >
          <Text className="text-xs font-bold text-slate-100">
            {cell.variant === 'flag' ? '🚩' : cell.variant === 'mine' ? '💣' : cell.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
