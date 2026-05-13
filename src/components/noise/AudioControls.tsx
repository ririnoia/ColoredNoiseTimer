import type { NoiseType } from '@/lib/constants'

interface AudioControlsProps {
  isPlaying: boolean
  noiseType: NoiseType
  onPlay: () => void
  onStop: () => void
}

export function AudioControls({ isPlaying, noiseType, onPlay, onStop }: AudioControlsProps) {
  return (
    <button
      type="button"
      onClick={isPlaying ? onStop : onPlay}
      className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
        isPlaying
          ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
          : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
      }`}
    >
      {isPlaying ? `■ ${noiseType} を停止` : `▶ ${noiseType} を再生`}
    </button>
  )
}
