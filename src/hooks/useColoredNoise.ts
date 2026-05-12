import { useRef, useCallback, useEffect } from 'react'
import { createNoiseNode } from '@/lib/noise/generators'
import type { NoiseType } from '@/lib/noise/types'

interface UseColoredNoiseReturn {
  play: (type: NoiseType, volume: number) => void
  stop: () => void
  setVolume: (volume: number) => void
}

export function useColoredNoise(): UseColoredNoiseReturn {
  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  const stop = useCallback(() => {
    sourceRef.current?.stop()
    sourceRef.current?.disconnect()
    sourceRef.current = null
  }, [])

  const play = useCallback(
    (type: NoiseType, volume: number) => {
      stop()

      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = new AudioContext()
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const gain = gainRef.current ?? ctx.createGain()
      gain.gain.value = volume
      gain.connect(ctx.destination)
      gainRef.current = gain

      const source = createNoiseNode(ctx, type)
      source.connect(gain)
      source.start()
      sourceRef.current = source
    },
    [stop]
  )

  const setVolume = useCallback((volume: number) => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume
    }
  }, [])

  useEffect(() => {
    return () => {
      stop()
      ctxRef.current?.close()
    }
  }, [stop])

  return { play, stop, setVolume }
}
