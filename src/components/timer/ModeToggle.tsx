import type { TimerMode } from '@/hooks/usePomodoroTimer'

interface ModeToggleProps {
  mode: TimerMode
  onSwitch: (mode: TimerMode) => void
}

const MODES: { value: TimerMode; label: string }[] = [
  { value: 'focus', label: '集中' },
  { value: 'break', label: '休憩' },
]

export function ModeToggle({ mode, onSwitch }: ModeToggleProps) {
  return (
    <div role="group" aria-label="モード切り替え" className="flex bg-gray-900 rounded-full p-1 w-fit mx-auto">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSwitch(value)}
          aria-pressed={mode === value}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === value
              ? 'bg-white text-gray-900'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
