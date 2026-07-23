import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setMusicEnabled, setVolume } from '@/store/settingsSlice'
import { Slider } from '@miblanchard/react-native-slider'
import { useAudioPlayer } from 'expo-audio'
import { useEffect, useRef, useState } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

const THEME_MUSIC = require('../../assets/audio/theme.wav')

const SLIDER_WIDTH = 100
const CLOSE_DELAY = 200

export default function MusicToggle() {
  const player = useAudioPlayer(THEME_MUSIC)
  const dispatch = useAppDispatch()
  const isMusicEnabled = useAppSelector((state) => state.settings.isMusicEnabled)
  const volume = useAppSelector((state) => state.settings.volume)
  const [showSlider, setShowSlider] = useState(false)
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(Platform.OS !== 'web')
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDragging = useRef(false)

  // On web, browsers reject play() until the user has interacted with the
  // page at least once. Skip the attempt entirely until we know it's
  // unlocked, instead of calling play() speculatively and eating the error.
  const canAutoplay = Platform.OS !== 'web' || isAudioUnlocked

  useEffect(() => {
    player.loop = true
    if (isMusicEnabled && canAutoplay) {
      player.play()
    } else {
      player.pause()
    }
  }, [isMusicEnabled, canAutoplay, player])

  useEffect(() => {
    player.volume = volume
  }, [player, volume])

  function openSlider() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setShowSlider(true)
  }

  function scheduleCloseSlider() {
    if (isDragging.current) return
    closeTimer.current = setTimeout(() => setShowSlider(false), CLOSE_DELAY)
  }

  return (
    <View className="absolute right-8 top-4 z-10 items-end gap-2">
      <Pressable
        onHoverIn={openSlider}
        onHoverOut={scheduleCloseSlider}
        onPress={() => {
          setIsAudioUnlocked(true)
          dispatch(setMusicEnabled(!isMusicEnabled))
        }}
        className="h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 active:bg-slate-700"
      >
        <Text className="text-lg">{isAudioUnlocked && isMusicEnabled ? '🔊' : '🔇'}</Text>
      </Pressable>
      <Pressable
        onHoverIn={openSlider}
        onHoverOut={scheduleCloseSlider}
        style={{ pointerEvents: showSlider ? 'auto' : 'none' }}
        className={`rounded-full bg-slate-800/90 px-3 py-2 shadow ${showSlider ? 'opacity-100' : 'opacity-0'}`}
      >
        <Slider
          value={volume}
          minimumValue={0}
          maximumValue={1}
          containerStyle={{ width: SLIDER_WIDTH, height: 24 }}
          trackStyle={{ height: 6, borderRadius: 3 }}
          thumbStyle={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' }}
          minimumTrackTintColor="#34d399"
          maximumTrackTintColor="#475569"
          onSlidingStart={() => {
            isDragging.current = true
            openSlider()
            setIsAudioUnlocked(true)
            if (!isMusicEnabled) dispatch(setMusicEnabled(true))
          }}
          onValueChange={(values) => dispatch(setVolume(Array.isArray(values) ? values[0] : values))}
          onSlidingComplete={() => {
            isDragging.current = false
            scheduleCloseSlider()
          }}
        />
      </Pressable>
    </View>
  )
}
