interface TimerSettingsProps {
  focusMinutes: number
  breakMinutes: number
  endSoundEnabled: boolean
  onFocusChange: (minutes: number) => void
  onBreakChange: (minutes: number) => void
  onEndSoundChange: (enabled: boolean) => void
}

export function TimerSettings({
  focusMinutes,
  breakMinutes,
  endSoundEnabled,
  onFocusChange,
  onBreakChange,
  onEndSoundChange,
}: TimerSettingsProps) {
  const clamp = (v: number) => Math.max(1, Math.min(99, v))

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">設定</p>

      <div className="flex items-center justify-between">
        <label htmlFor="focus-minutes" className="text-sm text-gray-300">
          集中時間
        </label>
        <div className="flex items-center gap-2">
          <input
            id="focus-minutes"
            type="number"
            min={1}
            max={99}
            value={focusMinutes}
            onChange={(e) => {
              const v = clamp(Number(e.target.value))
              if (!isNaN(v)) onFocusChange(v)
            }}
            className="w-16 bg-gray-900 text-gray-100 text-right rounded-lg px-2 py-1.5 text-sm"
          />
          <span className="text-sm text-gray-400">分</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="break-minutes" className="text-sm text-gray-300">
          休憩時間
        </label>
        <div className="flex items-center gap-2">
          <input
            id="break-minutes"
            type="number"
            min={1}
            max={99}
            value={breakMinutes}
            onChange={(e) => {
              const v = clamp(Number(e.target.value))
              if (!isNaN(v)) onBreakChange(v)
            }}
            className="w-16 bg-gray-900 text-gray-100 text-right rounded-lg px-2 py-1.5 text-sm"
          />
          <span className="text-sm text-gray-400">分</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">終了音</span>
        <button
          type="button"
          role="switch"
          aria-checked={endSoundEnabled}
          aria-label="終了音"
          onClick={() => onEndSoundChange(!endSoundEnabled)}
          className={`relative w-10 h-6 rounded-full transition-colors ${
            endSoundEnabled ? 'bg-white' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-gray-900 transition-transform ${
              endSoundEnabled ? 'translate-x-4' : ''
            }`}
          />
          <span className="sr-only">{endSoundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  )
}
