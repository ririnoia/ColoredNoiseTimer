import { formatTime } from '@/lib/timer/formatTime'
import type { TimerMode } from '@/hooks/usePomodoroTimer'

interface TimerDisplayProps {
  seconds: number
  totalSeconds: number
  mode: TimerMode
}

const RADIUS = 108
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const RING_COLOR: Record<TimerMode, string> = {
  focus: 'stroke-indigo-400 dark:stroke-indigo-500',
  break: 'stroke-emerald-400 dark:stroke-emerald-500',
}

export function TimerDisplay({ seconds, totalSeconds, mode }: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  const m = Math.floor(seconds / 60)
  const s = seconds % 60

  return (
    <div className="relative w-60 h-60 mx-auto">
      <svg viewBox="0 0 240 240" className="w-full h-full" aria-hidden="true">
        {/* 背景リング */}
        <circle
          cx="120" cy="120" r={RADIUS}
          fill="none"
          strokeWidth="6"
          className="stroke-gray-200 dark:stroke-gray-800"
        />
        {/* 進捗リング（12時の位置からスタート） */}
        <circle
          cx="120" cy="120" r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 120 120)"
          className={RING_COLOR[mode]}
          style={{ transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>

      {/* タイマー数字（中央に重ねる） */}
      <div className="absolute inset-0 flex items-center justify-center">
        <time
          dateTime={`PT${m}M${s}S`}
          className="text-6xl font-mono font-bold tracking-tight text-gray-950 dark:text-white tabular-nums"
        >
          {formatTime(seconds)}
        </time>
      </div>
    </div>
  )
}
