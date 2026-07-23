import type { ReactNode } from 'react'

interface WindowFrameProps {
  title: string
  children: ReactNode
  className?: string
}

export default function WindowFrame({ title, children, className = '' }: WindowFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 shadow-xl ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-800/80 px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-2 truncate text-sm font-medium text-slate-300">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
