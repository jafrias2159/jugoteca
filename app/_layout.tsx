import '../global.css'
import MusicToggle from '@/components/MusicToggle'
import { useSettingsPersistence } from '@/store/useSettingsPersistence'
import { store } from '@/store/store'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

function SettingsPersistenceGate() {
  useSettingsPersistence()
  return null
}

export default function RootLayout() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <SettingsPersistenceGate />
        <View className="flex-1 bg-slate-950">
          <StatusBar style="light" />
          {isMounted && <MusicToggle />}
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </Provider>
    </SafeAreaProvider>
  )
}
