'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer'
import type { TimerMode } from '@/hooks/usePomodoroTimer'
import { useColoredNoise } from '@/hooks/useColoredNoise'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useNotification } from '@/hooks/useNotification'
import {
  NOISE_TYPES,
  DEFAULT_NOISE,
  DEFAULT_VOLUME,
  DEFAULT_FOCUS_MINUTES,
  DEFAULT_BREAK_MINUTES,
  DEFAULT_END_SOUND_ENABLED,
} from '@/lib/constants'
import type { NoiseType } from '@/lib/constants'
import { ModeToggle } from '@/components/timer/ModeToggle'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { NoiseSelector } from '@/components/noise/NoiseSelector'
import { AudioControls } from '@/components/noise/AudioControls'
import { VolumeSlider } from '@/components/noise/VolumeSlider'
import { TimerSettings } from '@/components/settings/TimerSettings'
import { FutureAdSlot } from '@/components/ads/FutureAdSlot'

function safeNoiseType(raw: NoiseType): NoiseType {
  return (NOISE_TYPES as readonly string[]).includes(raw) ? raw : DEFAULT_NOISE
}

function safeMinutes(raw: number, fallback: number): number {
  return Number.isFinite(raw) && raw >= 1 && raw <= 99 ? Math.round(raw) : fallback
}

function safeVolume(raw: number): number {
  return Number.isFinite(raw) && raw >= 0 && raw <= 1 ? raw : DEFAULT_VOLUME
}

export default function Home() {
  const [rawNoiseType, setNoiseType] = useLocalStorage<NoiseType>('noiseType', DEFAULT_NOISE)
  const [rawVolume, setVolume] = useLocalStorage<number>('volume', DEFAULT_VOLUME)
  const [rawFocusMinutes, setFocusMinutes] = useLocalStorage<number>('focusMinutes', DEFAULT_FOCUS_MINUTES)
  const [rawBreakMinutes, setBreakMinutes] = useLocalStorage<number>('breakMinutes', DEFAULT_BREAK_MINUTES)
  const [rawEndSoundEnabled, setEndSoundEnabled] = useLocalStorage<boolean>('endSoundEnabled', DEFAULT_END_SOUND_ENABLED)

  const noiseType = safeNoiseType(rawNoiseType)
  const volume = safeVolume(rawVolume)
  const focusMinutes = safeMinutes(rawFocusMinutes, DEFAULT_FOCUS_MINUTES)
  const breakMinutes = safeMinutes(rawBreakMinutes, DEFAULT_BREAK_MINUTES)
  const endSoundEnabled = typeof rawEndSoundEnabled === 'boolean' ? rawEndSoundEnabled : DEFAULT_END_SOUND_ENABLED

  const [isPlaying, setIsPlaying] = useState(false)
  const noise = useColoredNoise()
  const { requestPermission, notify } = useNotification()

  // タイマー終了時に終了したモードを通知文に使うためrefで追跡
  const timerModeRef = useRef<TimerMode>('focus')

  const stopNoise = useCallback(() => {
    noise.stop()
    setIsPlaying(false)
  }, [noise])

  const handleTimerEnd = useCallback(() => {
    stopNoise()
    if (timerModeRef.current === 'focus') {
      notify('集中タイマー終了', { body: '休憩しましょう', icon: '/favicon.ico' })
    } else {
      notify('休憩タイマー終了', { body: '集中を再開しましょう', icon: '/favicon.ico' })
    }
  }, [stopNoise, notify])

  const timer = usePomodoroTimer({
    focusMinutes,
    breakMinutes,
    endSoundEnabled,
    onEnd: handleTimerEnd,
  })

  useEffect(() => {
    timerModeRef.current = timer.mode
  }, [timer.mode])

  // タイマー操作（ノイズ連動 + 通知許可リクエスト）
  const handleTimerStart = () => {
    requestPermission()
    timer.start()
    noise.play(noiseType, volume)
    setIsPlaying(true)
  }

  const handleTimerStop = () => {
    timer.stop()
    stopNoise()
  }

  const handleTimerReset = () => {
    timer.reset()
    stopNoise()
  }

  const handleSwitchMode = (mode: TimerMode) => {
    timer.switchMode(mode)
    stopNoise()
  }

  // ノイズ単独操作
  const handlePlay = () => {
    noise.play(noiseType, volume)
    setIsPlaying(true)
  }

  const handleNoiseTypeChange = (type: NoiseType) => {
    setNoiseType(type)
    if (isPlaying) noise.play(type, volume)
  }

  const handleVolumeChange = (v: number) => {
    setVolume(v)
    noise.setVolume(v)
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <h1 className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          ColoredNoiseTimer
        </h1>

        {/* タイマーセクション */}
        <div className="flex flex-col gap-4">
          <ModeToggle mode={timer.mode} onSwitch={handleSwitchMode} />

          <div className="flex flex-col gap-1">
            <TimerDisplay seconds={timer.remainingSeconds} />
            <TimerSettings
              focusMinutes={focusMinutes}
              breakMinutes={breakMinutes}
              endSoundEnabled={endSoundEnabled}
              onFocusChange={setFocusMinutes}
              onBreakChange={setBreakMinutes}
              onEndSoundChange={setEndSoundEnabled}
            />
          </div>

          <TimerControls
            isRunning={timer.isRunning}
            onStart={handleTimerStart}
            onStop={handleTimerStop}
            onReset={handleTimerReset}
          />
        </div>

        <hr className="border-gray-200 dark:border-gray-800" />

        {/* ノイズセクション */}
        <div className="flex flex-col gap-4">
          <NoiseSelector selected={noiseType} onChange={handleNoiseTypeChange} />
          <AudioControls
            isPlaying={isPlaying}
            noiseType={noiseType}
            onPlay={handlePlay}
            onStop={stopNoise}
          />
          <VolumeSlider volume={volume} onChange={handleVolumeChange} />
        </div>

        <FutureAdSlot />

      </div>
    </main>
  )
}
