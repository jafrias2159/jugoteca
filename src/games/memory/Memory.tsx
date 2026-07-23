import { useEffect, useState } from 'react'

const EMOJIS = ['🍎', '🍋', '🍇', '🍓', '🍒', '🍌', '🍍', '🥝']

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

function createDeck(): Card[] {
  const deck = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function Memory() {
  const [cards, setCards] = useState<Card[]>(createDeck)
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)

  const isWon = cards.every((card) => card.isMatched)

  useEffect(() => {
    if (selected.length !== 2) return

    const [firstIndex, secondIndex] = selected
    setMoves((m) => m + 1)

    setCards((prev) => {
      const first = prev[firstIndex]
      const second = prev[secondIndex]

      if (first.emoji === second.emoji) {
        return prev.map((card, i) =>
          i === firstIndex || i === secondIndex ? { ...card, isMatched: true } : card,
        )
      }
      return prev
    })

    const isMatch = cards[firstIndex].emoji === cards[secondIndex].emoji
    if (isMatch) {
      setSelected([])
      return
    }

    const timeout = setTimeout(() => {
      setCards((prev) =>
        prev.map((card, i) =>
          i === firstIndex || i === secondIndex ? { ...card, isFlipped: false } : card,
        ),
      )
      setSelected([])
    }, 700)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  function handleFlip(index: number) {
    if (selected.length === 2) return
    if (cards[index].isFlipped || cards[index].isMatched) return

    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)))
    setSelected((prev) => [...prev, index])
  }

  function reset() {
    setCards(createDeck())
    setSelected([])
    setMoves(0)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-slate-400">
        {isWon ? `¡Completado en ${moves} movimientos!` : `Movimientos: ${moves}`}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, index) => (
          <button
            key={card.id}
            type="button"
            onClick={() => handleFlip(index)}
            className={`flex h-16 w-16 items-center justify-center rounded-lg text-2xl transition ${
              card.isFlipped || card.isMatched ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {card.isFlipped || card.isMatched ? card.emoji : ''}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Reiniciar
      </button>
    </div>
  )
}
