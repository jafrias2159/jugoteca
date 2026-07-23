import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const OPTIONS = [
  { id: 'piedra', emoji: '🪨', label: 'Piedra' },
  { id: 'papel', emoji: '📄', label: 'Papel' },
  { id: 'tijera', emoji: '✂️', label: 'Tijera' },
] as const

type Choice = (typeof OPTIONS)[number]['id']

const BEATS: Record<Choice, Choice> = {
  piedra: 'tijera',
  papel: 'piedra',
  tijera: 'papel',
}

function pickComputer(): Choice {
  return OPTIONS[Math.floor(Math.random() * OPTIONS.length)].id
}

function optionFor(choice: Choice) {
  return OPTIONS.find((o) => o.id === choice)!
}

export default function RockPaperScissors() {
  const [player, setPlayer] = useState<Choice | null>(null)
  const [computer, setComputer] = useState<Choice | null>(null)
  const [score, setScore] = useState({ wins: 0, losses: 0, ties: 0 })

  function play(choice: Choice) {
    const cpu = pickComputer()
    setPlayer(choice)
    setComputer(cpu)

    if (choice === cpu) setScore((s) => ({ ...s, ties: s.ties + 1 }))
    else if (BEATS[choice] === cpu) setScore((s) => ({ ...s, wins: s.wins + 1 }))
    else setScore((s) => ({ ...s, losses: s.losses + 1 }))
  }

  let result = 'Elige una opción'
  if (player && computer) {
    if (player === computer) result = 'Empate'
    else if (BEATS[player] === computer) result = '¡Ganaste!'
    else result = 'Perdiste'
  }

  return (
    <View className="items-center gap-4">
      <Text className="text-sm text-slate-400">
        Ganadas: {score.wins} · Perdidas: {score.losses} · Empates: {score.ties}
      </Text>
      {player && computer && (
        <View className="flex-row items-center gap-4">
          <Text className="text-3xl">{optionFor(player).emoji}</Text>
          <Text className="text-slate-400">vs</Text>
          <Text className="text-3xl">{optionFor(computer).emoji}</Text>
        </View>
      )}
      <Text className="text-lg font-medium text-slate-200">{result}</Text>
      <View className="flex-row gap-2">
        {OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => play(option.id)}
            className="items-center gap-1 rounded-lg bg-slate-800 px-3 py-3 active:bg-slate-700"
          >
            <Text className="text-2xl">{option.emoji}</Text>
            <Text className="text-[10px] text-slate-400">{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}
