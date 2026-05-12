import { useState, useEffect, useRef, useCallback } from 'react'
import { formatTime } from '@/lib/timer/formatTime'
import { DEFAULT_FOCUS_MINUTES, DEFAULT_BREAK_MINUTES } from '@/lib/constants'

export type TimerMode = 'focus' | 'break'

interface PomodoroTimerOptions {
  focusMinutes?: number
  breakMinutes?: number
  endSoundEnabled: boolean
  onEnd?: () => void
}

export function usePomodoroTimer({
  focusMinutes = DEFAULT_FOCUS_MINUTES,
  breakMinutes = DEFAULT_BREAK_MINUTES,
  endSoundEnabled,
  onEnd,
}: PomodoroTimerOptions) {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [isRunning, setIsRunning] = useState(false)
  // remainingSeconds is only authoritative when the timer has been started/paused.
  // Before first start (or after reset), displayed time is derived from settings.
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const settingsSeconds = mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60
  const displaySeconds = remainingSeconds ?? settingsSeconds

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const current = prev ?? settingsSeconds
        if (current <= 1) {
          clear()
          setIsRunning(false)
          if (endSoundEnabled) playEndSound()
          onEnd?.()
          return 0
        }
        return current - 1
      })
    }, 1000)
    return clear
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, clear, endSoundEnabled])

  // Update document.title while running
  useEffect(() => {
    if (isRunning) {
      const label = mode === 'focus' ? 'Focus' : 'Break'
      document.title = `${formatTime(displaySeconds)} - ${label} | ColoredNoiseTimer`
    } else {
      document.title = 'ColoredNoiseTimer'
    }
  }, [isRunning, displaySeconds, mode])

  const start = useCallback(() => {
    // Initialise remainingSeconds from settings if not yet started
    setRemainingSeconds((prev) => prev ?? settingsSeconds)
    setIsRunning(true)
  }, [settingsSeconds])

  const stop = useCallback(() => {
    setIsRunning(false)
    clear()
  }, [clear])

  const reset = useCallback(() => {
    clear()
    setIsRunning(false)
    setRemainingSeconds(null) // derived from settings again
  }, [clear])

  const switchMode = useCallback(
    (next: TimerMode) => {
      clear()
      setIsRunning(false)
      setMode(next)
      setRemainingSeconds(null)
    },
    [clear]
  )

  return {
    mode,
    isRunning,
    remainingSeconds: displaySeconds,
    totalSeconds: settingsSeconds,
    start,
    stop,
    reset,
    switchMode,
  }
}

function playEndSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    osc.start()
    osc.stop(ctx.currentTime + 1.5)
    osc.onended = () => ctx.close()
  } catch {
    // AudioContext not available in this environment
  }
}
