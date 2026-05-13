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
    <div className="flex items-center justify-center gap-5 text-sm text-gray-400">

      <div className="flex items-center gap-1.5">
        <label htmlFor="focus-minutes">集中</label>
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
          className="w-12 bg-gray-900 text-gray-100 text-center rounded px-1 py-1"
        />
        <span>分</span>
      </div>

      <div className="flex items-center gap-1.5">
        <label htmlFor="break-minutes">休憩</label>
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
          className="w-12 bg-gray-900 text-gray-100 text-center rounded px-1 py-1"
        />
        <span>分</span>
      </div>

      <div className="flex items-center gap-2">
        <span>終了音</span>
        <button
          type="button"
          role="switch"
          aria-checked={endSoundEnabled}
          aria-label="終了音"
          onClick={() => onEndSoundChange(!endSoundEnabled)}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            endSoundEnabled ? 'bg-white' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-900 transition-transform ${
              endSoundEnabled ? 'translate-x-4' : ''
            }`}
          />
          <span className="sr-only">{endSoundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

    </div>
  )
}
