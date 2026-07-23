import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { hydrateSettings, type SettingsState } from './settingsSlice'

const STORAGE_KEY = 'jugoteca:settings'

export function useSettingsPersistence() {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.settings)
  const isHydrated = useRef(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) dispatch(hydrateSettings(JSON.parse(raw) as SettingsState))
      })
      .finally(() => {
        isHydrated.current = true
      })
  }, [dispatch])

  useEffect(() => {
    if (!isHydrated.current) return
    const timeout = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    }, 400)
    return () => clearTimeout(timeout)
  }, [settings])
}
