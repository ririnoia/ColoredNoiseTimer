import { NOISE_TYPES } from '@/lib/constants'
import type { NoiseType } from '@/lib/constants'

const NOISE_COLORS: Record<NoiseType, string> = {
  'White Noise':  'bg-white',
  'Grey Noise':   'bg-gray-400',
  'Pink Noise':   'bg-pink-400',
  'Brown Noise':  'bg-amber-800',
  'Blue Noise':   'bg-blue-500',
  'Violet Noise': 'bg-violet-500',
}

interface NoiseSelectorProps {
  selected: NoiseType
  onChange: (type: NoiseType) => void
}

export function NoiseSelector({ selected, onChange }: NoiseSelectorProps) {
  return (
    <div role="group" aria-label="ノイズの種類" className="flex justify-center gap-4">
      {NOISE_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          aria-pressed={selected === type}
          aria-label={type}
          className={`w-8 h-8 rounded-full transition-all ${NOISE_COLORS[type]} ${
            selected === type
              ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-110'
              : 'opacity-50 hover:opacity-80'
          }`}
        />
      ))}
    </div>
  )
}
