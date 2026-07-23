import '../global.css'
import { useSettingsPersistence } from '@/store/useSettingsPersistence'
import { store } from '@/store/store'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'react-redux'
import { View } from 'react-native'

function SettingsPersistenceGate() {
  useSettingsPersistence()
  return null
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SettingsPersistenceGate />
      <View className="flex-1 bg-slate-950">
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </Provider>
  )
}
