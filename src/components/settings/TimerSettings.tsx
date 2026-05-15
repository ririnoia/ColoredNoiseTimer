interface TimerSettingsProps {
  focusMinutes: number
  breakMinutes: number
  endSoundEnabled: boolean
  autoStart: boolean
  onFocusChange: (minutes: number) => void
  onBreakChange: (minutes: number) => void
  onEndSoundChange: (enabled: boolean) => void
  onAutoStartChange: (enabled: boolean) => void
}

function ToggleSwitch({ checked, onChange, label }: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-900 transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
        <span className="sr-only">{checked ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  )
}

export function TimerSettings({
  focusMinutes,
  breakMinutes,
  endSoundEnabled,
  autoStart,
  onFocusChange,
  onBreakChange,
  onEndSoundChange,
  onAutoStartChange,
}: TimerSettingsProps) {
  const clamp = (v: number) => Math.max(1, Math.min(99, v))

  return (
    <div className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-100">

      {/* 時間設定 */}
      <div className="flex items-center justify-center gap-5">
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
            className="w-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-center rounded px-1 py-1"
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
            className="w-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-center rounded px-1 py-1"
          />
          <span>分</span>
        </div>
      </div>

      {/* トグル設定 */}
      <div className="flex items-center justify-center gap-6">
        <ToggleSwitch checked={endSoundEnabled} onChange={onEndSoundChange} label="終了音" />
        <ToggleSwitch checked={autoStart} onChange={onAutoStartChange} label="自動開始" />
      </div>

    </div>
  )
}
