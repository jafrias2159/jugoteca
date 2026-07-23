import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

interface WindowFrameProps {
  title: string
  children: ReactNode
  className?: string
}

export default function WindowFrame({ title, children, className = '' }: WindowFrameProps) {
  return (
    <View
      className={`overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 ${className}`}
    >
      <View className="flex-row items-center gap-2 border-b border-slate-700/60 bg-slate-800/80 px-4 py-2">
        <View className="h-3 w-3 rounded-full bg-red-500" />
        <View className="h-3 w-3 rounded-full bg-yellow-500" />
        <View className="h-3 w-3 rounded-full bg-green-500" />
        <Text className="ml-2 text-sm font-medium text-slate-300" numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View className="p-4">{children}</View>
    </View>
  )
}
