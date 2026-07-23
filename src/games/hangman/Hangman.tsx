import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const WORDS = ['REACT', 'JAVASCRIPT', 'NATIVE', 'EXPO', 'JUGOTECA', 'TECLADO', 'NARANJA', 'MEMORIA']

const MAX_ERRORS = 6
const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

export default function Hangman() {
  const [word, setWord] = useState(pickWord)
  const [guessed, setGuessed] = useState<string[]>([])

  const wrongGuesses = guessed.filter((letter) => !word.includes(letter))
  const isWon = word.split('').every((letter) => guessed.includes(letter))
  const isLost = wrongGuesses.length >= MAX_ERRORS
  const isOver = isWon || isLost

  function guess(letter: string) {
    if (isOver || guessed.includes(letter)) return
    setGuessed((prev) => [...prev, letter])
  }

  function reset() {
    setWord(pickWord())
    setGuessed([])
  }

  return (
    <View className="items-center gap-4">
      <Text className="text-sm text-slate-400">
        Errores: {wrongGuesses.length} / {MAX_ERRORS}
      </Text>
      <View className="flex-row flex-wrap justify-center gap-2">
        {word.split('').map((letter, i) => (
          <View key={i} className="h-10 w-8 items-center justify-center border-b-2 border-slate-500">
            <Text className="text-lg font-bold text-slate-100">
              {guessed.includes(letter) || isLost ? letter : ''}
            </Text>
          </View>
        ))}
      </View>
      {isWon && <Text className="text-sm text-emerald-400">¡Ganaste!</Text>}
      {isLost && <Text className="text-sm text-red-400">Perdiste, la palabra era {word}</Text>}
      <View className="flex-row flex-wrap justify-center gap-1.5">
        {ALPHABET.map((letter) => {
          const used = guessed.includes(letter)
          const correct = used && word.includes(letter)
          return (
            <Pressable
              key={letter}
              onPress={() => guess(letter)}
              disabled={used || isOver}
              className={`h-8 w-8 items-center justify-center rounded-md ${
                used ? (correct ? 'bg-emerald-700' : 'bg-red-900') : 'bg-slate-800 active:bg-slate-700'
              }`}
            >
              <Text className="text-xs font-bold text-slate-100">{letter}</Text>
            </Pressable>
          )
        })}
      </View>
      <Pressable onPress={reset} className="rounded-lg bg-indigo-600 px-4 py-2 active:bg-indigo-500">
        <Text className="text-sm font-medium text-white">Nueva palabra</Text>
      </Pressable>
    </View>
  )
}
