import { NOISE_TYPES } from '@/lib/constants'
import type { NoiseType } from '@/lib/constants'

interface NoiseSelectorProps {
  selected: NoiseType
  onChange: (type: NoiseType) => void
}

export function NoiseSelector({ selected, onChange }: NoiseSelectorProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">ノイズの種類</p>
      <div role="group" aria-label="ノイズの種類" className="grid grid-cols-2 gap-2">
        {NOISE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={selected === type}
            className={`py-2 px-3 rounded-lg text-sm font-medium text-left transition-colors ${
              selected === type
                ? 'bg-white text-gray-900'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
