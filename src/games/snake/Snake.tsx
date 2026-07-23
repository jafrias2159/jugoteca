import { useEffect, useRef, useState } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

const SIZE = 12
const TICK_MS = 200

interface Point {
  x: number
  y: number
}

type Direction = 'up' | 'down' | 'left' | 'right'

const DELTAS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

function randomFood(snake: Point[]): Point {
  let point: Point
  do {
    point = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) }
  } while (snake.some((s) => s.x === point.x && s.y === point.y))
  return point
}

function initialSnake(): Point[] {
  const mid = Math.floor(SIZE / 2)
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
}

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>(initialSnake)
  const [food, setFood] = useState<Point>(() => randomFood(initialSnake()))
  const [isRunning, setIsRunning] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const directionRef = useRef<Direction>('right')
  const nextDirectionRef = useRef<Direction>('right')

  function changeDirection(next: Direction) {
    if (OPPOSITE[next] === directionRef.current) return
    nextDirectionRef.current = next
  }

  useEffect(() => {
    if (Platform.OS !== 'web') return
    function handleKey(e: KeyboardEvent) {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      }
      const next = map[e.key]
      if (next) {
        e.preventDefault()
        changeDirection(next)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (!isRunning || isGameOver) return
    const id = setInterval(() => {
      setSnake((prev) => {
        const dir = nextDirectionRef.current
        directionRef.current = dir
        const delta = DELTAS[dir]
        const head = prev[0]
        const newHead = { x: head.x + delta.x, y: head.y + delta.y }

        const hitsWall = newHead.x < 0 || newHead.x >= SIZE || newHead.y < 0 || newHead.y >= SIZE
        const hitsSelf = prev.some((s) => s.x === newHead.x && s.y === newHead.y)

        if (hitsWall || hitsSelf) {
          setIsGameOver(true)
          setIsRunning(false)
          return prev
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y
        const nextSnake = [newHead, ...prev]
        if (ateFood) {
          setFood(randomFood(nextSnake))
        } else {
          nextSnake.pop()
        }
        return nextSnake
      })
    }, TICK_MS)
    return () => clearInterval(id)
  }, [isRunning, isGameOver, food])

  function start() {
    const snakeInit = initialSnake()
    setSnake(snakeInit)
    setFood(randomFood(snakeInit))
    directionRef.current = 'right'
    nextDirectionRef.current = 'right'
    setIsGameOver(false)
    setIsRunning(true)
  }

  const snakeKeys = new Set(snake.map((s) => `${s.x}-${s.y}`))
  const score = snake.length - 3

  return (
    <View className="items-center gap-4">
      <Text className="text-sm text-slate-400">
        {isGameOver ? `Perdiste. Puntos: ${score}` : `Puntos: ${score}`}
      </Text>
      <View className="gap-0.5 rounded-lg bg-slate-900 p-1">
        {Array.from({ length: SIZE }, (_, y) => (
          <View key={y} className="flex-row gap-0.5">
            {Array.from({ length: SIZE }, (_, x) => {
              const isSnake = snakeKeys.has(`${x}-${y}`)
              const isFood = food.x === x && food.y === y
              return (
                <View
                  key={x}
                  className={`h-4 w-4 rounded-sm ${
                    isFood ? 'bg-red-500' : isSnake ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                />
              )
            })}
          </View>
        ))}
      </View>
      {!isRunning && (
        <Pressable onPress={start} className="rounded-lg bg-indigo-600 px-4 py-2 active:bg-indigo-500">
          <Text className="text-sm font-medium text-white">
            {isGameOver ? 'Reintentar' : 'Empezar'}
          </Text>
        </Pressable>
      )}
      {isRunning && (
        <View className="items-center gap-1">
          <Pressable
            onPress={() => changeDirection('up')}
            className="h-10 w-10 items-center justify-center rounded-md bg-slate-800 active:bg-slate-700"
          >
            <Text className="text-slate-100">▲</Text>
          </Pressable>
          <View className="flex-row gap-1">
            <Pressable
              onPress={() => changeDirection('left')}
              className="h-10 w-10 items-center justify-center rounded-md bg-slate-800 active:bg-slate-700"
            >
              <Text className="text-slate-100">◀</Text>
            </Pressable>
            <Pressable
              onPress={() => changeDirection('down')}
              className="h-10 w-10 items-center justify-center rounded-md bg-slate-800 active:bg-slate-700"
            >
              <Text className="text-slate-100">▼</Text>
            </Pressable>
            <Pressable
              onPress={() => changeDirection('right')}
              className="h-10 w-10 items-center justify-center rounded-md bg-slate-800 active:bg-slate-700"
            >
              <Text className="text-slate-100">▶</Text>
            </Pressable>
          </View>
          <Text className="text-xs text-slate-500">
            {Platform.OS === 'web' ? 'o usa las flechas del teclado' : ''}
          </Text>
        </View>
      )}
    </View>
  )
}
