interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  onReset: () => void
}

export function TimerControls({ isRunning, onStart, onStop, onReset }: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={isRunning ? onStop : onStart}
        className="min-w-[120px] px-8 py-3 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
      >
        {isRunning ? '停止' : '開始'}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="px-4 py-3 text-sm text-gray-500 hover:text-gray-200 transition-colors"
      >
        リセット
      </button>
    </div>
  )
}
