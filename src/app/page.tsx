'use client'

import { useState } from 'react'
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer'
import { useColoredNoise } from '@/hooks/useColoredNoise'
import { useLocalStorage } from '@/hooks/useLocalStorage'
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

  // Validate localStorage values before use — guards against stale, corrupted or out-of-range data
  const noiseType = safeNoiseType(rawNoiseType)
  const volume = safeVolume(rawVolume)
  const focusMinutes = safeMinutes(rawFocusMinutes, DEFAULT_FOCUS_MINUTES)
  const breakMinutes = safeMinutes(rawBreakMinutes, DEFAULT_BREAK_MINUTES)
  const endSoundEnabled = typeof rawEndSoundEnabled === 'boolean' ? rawEndSoundEnabled : DEFAULT_END_SOUND_ENABLED

  const [isPlaying, setIsPlaying] = useState(false)
  const noise = useColoredNoise()

  const timer = usePomodoroTimer({ focusMinutes, breakMinutes, endSoundEnabled })

  const handlePlay = () => {
    noise.play(noiseType, volume)
    setIsPlaying(true)
  }

  const handleNoiseStop = () => {
    noise.stop()
    setIsPlaying(false)
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
    <main className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-sm flex flex-col gap-8">

        <h1 className="text-center text-xs font-medium text-gray-500 tracking-widest uppercase">
          ColoredNoiseTimer
        </h1>

        <ModeToggle mode={timer.mode} onSwitch={timer.switchMode} />

        <TimerDisplay seconds={timer.remainingSeconds} />

        <TimerControls
          isRunning={timer.isRunning}
          onStart={timer.start}
          onStop={timer.stop}
          onReset={timer.reset}
        />

        <hr className="border-gray-800" />

        <NoiseSelector selected={noiseType} onChange={handleNoiseTypeChange} />

        <AudioControls
          isPlaying={isPlaying}
          noiseType={noiseType}
          onPlay={handlePlay}
          onStop={handleNoiseStop}
        />

        <VolumeSlider volume={volume} onChange={handleVolumeChange} />

        <hr className="border-gray-800" />

        <TimerSettings
          focusMinutes={focusMinutes}
          breakMinutes={breakMinutes}
          endSoundEnabled={endSoundEnabled}
          onFocusChange={setFocusMinutes}
          onBreakChange={setBreakMinutes}
          onEndSoundChange={setEndSoundEnabled}
        />

        <FutureAdSlot />

      </div>
    </main>
  )
}
