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
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // remainingRef mirrors state so the interval callback always reads the current value
  // without relying on state updater timing (React 18 auto-batching makes that unreliable)
  const remainingRef = useRef<number | null>(null)
  const onEndRef = useRef(onEnd)
  const endSoundEnabledRef = useRef(endSoundEnabled)

  useEffect(() => { onEndRef.current = onEnd }, [onEnd])
  useEffect(() => { endSoundEnabledRef.current = endSoundEnabled }, [endSoundEnabled])

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
      const current = remainingRef.current ?? settingsSeconds
      const next = current <= 1 ? 0 : current - 1
      remainingRef.current = next
      setRemainingSeconds(next)
      if (next === 0) {
        clear()
        setIsRunning(false)
        if (endSoundEnabledRef.current) playEndSound()
        onEndRef.current?.()
      }
    }, 1000)
    return clear
  }, [isRunning, clear, settingsSeconds])

  useEffect(() => {
    if (isRunning) {
      const label = mode === 'focus' ? 'Focus' : 'Break'
      document.title = `${formatTime(displaySeconds)} - ${label} | ColoredNoiseTimer`
    } else {
      document.title = 'ColoredNoiseTimer'
    }
  }, [isRunning, displaySeconds, mode])

  useEffect(() => () => { document.title = 'ColoredNoiseTimer' }, [])

  const start = useCallback(() => {
    // Reset to settings if never started (null) or previously completed (0)
    const next = (remainingRef.current === null || remainingRef.current === 0)
      ? settingsSeconds
      : remainingRef.current
    remainingRef.current = next
    setRemainingSeconds(next)
    setIsRunning(true)
  }, [settingsSeconds])

  const stop = useCallback(() => {
    setIsRunning(false)
    clear()
  }, [clear])

  const reset = useCallback(() => {
    clear()
    setIsRunning(false)
    remainingRef.current = null
    setRemainingSeconds(null)
  }, [clear])

  const switchMode = useCallback(
    (next: TimerMode) => {
      clear()
      setIsRunning(false)
      setMode(next)
      remainingRef.current = null
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
