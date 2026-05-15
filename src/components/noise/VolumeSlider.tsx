interface VolumeSliderProps {
  volume: number
  onChange: (volume: number) => void
}

export function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  const percent = Math.round(volume * 100)
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="volume-slider" className="text-sm text-gray-500 dark:text-gray-100 shrink-0">
        音量
      </label>
      <input
        id="volume-slider"
        type="range"
        min={0}
        max={100}
        value={percent}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="flex-1 accent-gray-900 dark:accent-white h-1.5 cursor-pointer"
      />
      <span className="text-sm text-gray-500 dark:text-gray-100 w-8 text-right tabular-nums">{percent}</span>
    </div>
  )
}
