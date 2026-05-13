import { formatTime } from '@/lib/timer/formatTime'

interface TimerDisplayProps {
  seconds: number
}

export function TimerDisplay({ seconds }: TimerDisplayProps) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <div className="text-center pt-2 pb-0">
      <time
        dateTime={`PT${m}M${s}S`}
        className="text-8xl font-mono font-bold tracking-tight text-white tabular-nums"
      >
        {formatTime(seconds)}
      </time>
    </div>
  )
}
