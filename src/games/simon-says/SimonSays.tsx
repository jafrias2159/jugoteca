import { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const COLORS = ['red', 'blue', 'green', 'yellow'] as const
type Color = (typeof COLORS)[number]

const COLOR_CLASSES: Record<Color, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  yellow: 'bg-yellow-400',
}
const COLOR_ACTIVE_CLASSES: Record<Color, string> = {
  red: 'bg-red-300',
  blue: 'bg-blue-300',
  green: 'bg-emerald-300',
  yellow: 'bg-yellow-200',
}

type Phase = 'idle' | 'showing' | 'input' | 'gameover'

function randomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export default function SimonSays() {
  const [sequence, setSequence] = useState<Color[]>([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [activeColor, setActiveColor] = useState<Color | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout)
    }
  }, [])

  const playSequence = useCallback((seq: Color[]) => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    setPhase('showing')
    seq.forEach((color, i) => {
      timeouts.current.push(setTimeout(() => setActiveColor(color), i * 700))
      timeouts.current.push(setTimeout(() => setActiveColor(null), i * 700 + 400))
    })
    timeouts.current.push(
      setTimeout(() => {
        setPlayerIndex(0)
        setPhase('input')
      }, seq.length * 700),
    )
  }, [])

  function start() {
    const first = [randomColor()]
    setSequence(first)
    playSequence(first)
  }

  function handlePress(color: Color) {
    if (phase !== 'input') return
    if (sequence[playerIndex] !== color) {
      setPhase('gameover')
      return
    }
    if (playerIndex + 1 === sequence.length) {
      const next = [...sequence, randomColor()]
      setSequence(next)
      setPhase('showing')
      timeouts.current.push(setTimeout(() => playSequence(next), 500))
    } else {
      setPlayerIndex(playerIndex + 1)
    }
  }

  return (
    <View className="items-center gap-4">
      <Text className="text-sm text-slate-400">
        {phase === 'idle' && 'Presiona empezar'}
        {phase === 'showing' && 'Observa la secuencia...'}
        {phase === 'input' && 'Tu turno'}
        {phase === 'gameover' && `Perdiste en la ronda ${sequence.length}`}
      </Text>
      <View className="w-40 flex-row flex-wrap gap-2">
        {COLORS.map((color) => (
          <Pressable
            key={color}
            onPress={() => handlePress(color)}
            disabled={phase !== 'input'}
            className={`h-[76px] w-[76px] rounded-lg ${
              activeColor === color ? COLOR_ACTIVE_CLASSES[color] : COLOR_CLASSES[color]
            }`}
          />
        ))}
      </View>
      <Pressable onPress={start} className="rounded-lg bg-indigo-600 px-4 py-2 active:bg-indigo-500">
        <Text className="text-sm font-medium text-white">
          {phase === 'idle' ? 'Empezar' : 'Reiniciar'}
        </Text>
      </Pressable>
    </View>
  )
}
