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

// White Noise は白背景に溶け込むため、ライトモードでは濃いボーダーで輪郭を明確にする
const BORDER_COLORS: Record<NoiseType, string> = {
  'White Noise':  'border-gray-400 dark:border-0',
  'Grey Noise':   'border-gray-200 dark:border-0',
  'Pink Noise':   'border-gray-200 dark:border-0',
  'Brown Noise':  'border-gray-200 dark:border-0',
  'Blue Noise':   'border-gray-200 dark:border-0',
  'Violet Noise': 'border-gray-200 dark:border-0',
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
          className={`w-8 h-8 rounded-full transition-all border ${BORDER_COLORS[type]} ${NOISE_COLORS[type]} ${
            selected === type
              ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-gray-950 scale-110'
              : 'opacity-60 hover:opacity-90'
          }`}
        />
      ))}
    </div>
  )
}
