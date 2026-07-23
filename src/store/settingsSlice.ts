import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SettingsState {
  volume: number
  isMusicEnabled: boolean
}

const initialState: SettingsState = {
  volume: 0.25,
  isMusicEnabled: true,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.min(1, Math.max(0, action.payload))
    },
    setMusicEnabled(state, action: PayloadAction<boolean>) {
      state.isMusicEnabled = action.payload
    },
    hydrateSettings(_state, action: PayloadAction<SettingsState>) {
      return action.payload
    },
  },
})

export const { setVolume, setMusicEnabled, hydrateSettings } = settingsSlice.actions
export default settingsSlice.reducer
