import type { NoiseType } from '@/lib/constants'

interface AudioControlsProps {
  isPlaying: boolean
  noiseType: NoiseType
  onPlay: () => void
  onStop: () => void
}

export function AudioControls({ isPlaying, noiseType, onPlay, onStop }: AudioControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={isPlaying ? onStop : onPlay}
        aria-label={isPlaying ? `${noiseType} を停止` : `${noiseType} を再生`}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-colors ${
          isPlaying
            ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {isPlaying ? '■' : '▶'}
      </button>
      <span className="text-xs text-gray-400 dark:text-gray-500">
        {isPlaying ? `${noiseType} を再生中` : noiseType}
      </span>
    </div>
  )
}
