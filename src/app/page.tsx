'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer'
import type { TimerMode } from '@/hooks/usePomodoroTimer'
import { useColoredNoise } from '@/hooks/useColoredNoise'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useNotification } from '@/hooks/useNotification'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import {
  NOISE_TYPES,
  DEFAULT_NOISE,
  DEFAULT_VOLUME,
  DEFAULT_FOCUS_MINUTES,
  DEFAULT_BREAK_MINUTES,
  DEFAULT_END_SOUND_ENABLED,
  DEFAULT_AUTO_START,
} from '@/lib/constants'
import type { NoiseType } from '@/lib/constants'
import { ModeToggle } from '@/components/timer/ModeToggle'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { SessionCounter } from '@/components/timer/SessionCounter'
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
  const [rawAutoStart, setAutoStart] = useLocalStorage<boolean>('autoStart', DEFAULT_AUTO_START)
  const [sessionCount, setSessionCount] = useLocalStorage<number>('sessionCount', 0)
  const [sessionDate, setSessionDate] = useLocalStorage<string>('sessionDate', '')

  const noiseType = safeNoiseType(rawNoiseType)
  const volume = safeVolume(rawVolume)
  const focusMinutes = safeMinutes(rawFocusMinutes, DEFAULT_FOCUS_MINUTES)
  const breakMinutes = safeMinutes(rawBreakMinutes, DEFAULT_BREAK_MINUTES)
  const endSoundEnabled = typeof rawEndSoundEnabled === 'boolean' ? rawEndSoundEnabled : DEFAULT_END_SOUND_ENABLED
  const autoStart = typeof rawAutoStart === 'boolean' ? rawAutoStart : DEFAULT_AUTO_START

  // 今日の日付文字列（日付が変わったら自動リセット用）
  const today = new Date().toDateString()
  const displayCount = sessionDate === today ? (Number.isFinite(sessionCount) && sessionCount >= 0 ? sessionCount : 0) : 0

  const [isPlaying, setIsPlaying] = useState(false)

  // useColoredNoise の関数を直接分割代入することで安定した参照を得る
  const { play: noisePlay, stop: noiseStop, setVolume: noiseSetVolume } = useColoredNoise()
  const { requestPermission, notify } = useNotification()

  const timerModeRef = useRef<TimerMode>('focus')
  const switchModeRef = useRef<(mode: TimerMode) => void>(() => {})
  const autoStartRef = useRef(autoStart)
  const modeChangedByEndRef = useRef(false)
  // handleTimerEnd 内でセッション日付を参照するためのref
  const sessionDateRef = useRef(sessionDate)

  useEffect(() => { sessionDateRef.current = sessionDate }, [sessionDate])

  const stopNoise = useCallback(() => {
    noiseStop()
    setIsPlaying(false)
  }, [noiseStop])

  const handleTimerEnd = useCallback(() => {
    stopNoise()
    const endedMode = timerModeRef.current
    if (endedMode === 'focus') {
      notify('集中タイマー終了', { body: '休憩しましょう', icon: '/favicon.ico' })
      // 集中セッション完了時にカウントアップ（日付が変わっていたらリセット）
      const currentToday = new Date().toDateString()
      if (sessionDateRef.current !== currentToday) {
        setSessionDate(currentToday)
        setSessionCount(1)
      } else {
        setSessionCount((c) => (Number.isFinite(c) && c >= 0 ? c + 1 : 1))
      }
    } else {
      notify('休憩タイマー終了', { body: '集中を再開しましょう', icon: '/favicon.ico' })
    }
    switchModeRef.current(endedMode === 'focus' ? 'break' : 'focus')
    if (autoStartRef.current) {
      modeChangedByEndRef.current = true
    }
  }, [stopNoise, notify, setSessionCount, setSessionDate])

  const timer = usePomodoroTimer({
    focusMinutes,
    breakMinutes,
    endSoundEnabled,
    onEnd: handleTimerEnd,
  })

  useEffect(() => { timerModeRef.current = timer.mode }, [timer.mode])
  useEffect(() => { switchModeRef.current = timer.switchMode }, [timer.switchMode])
  useEffect(() => { autoStartRef.current = autoStart }, [autoStart])

  // 自動開始: timer.mode 変化後（コミット済み）にタイマーとノイズを開始する
  useEffect(() => {
    if (!modeChangedByEndRef.current) return
    modeChangedByEndRef.current = false
    timer.start()
    noisePlay(noiseType, volume)
    setIsPlaying(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.mode])

  // タイマー操作（ノイズ連動 + 通知許可リクエスト）
  const handleTimerStart = () => {
    requestPermission()
    timer.start()
    noisePlay(noiseType, volume)
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
    noisePlay(noiseType, volume)
    setIsPlaying(true)
  }

  const handleNoiseTypeChange = (type: NoiseType) => {
    setNoiseType(type)
    if (isPlaying) noisePlay(type, volume)
  }

  const handleVolumeChange = (v: number) => {
    setVolume(v)
    noiseSetVolume(v)
  }

  // キーボードショートカット
  useKeyboardShortcuts({
    onStartStop: () => { if (timer.isRunning) handleTimerStop(); else handleTimerStart() },
    onReset: handleTimerReset,
    onSwitchMode: () => handleSwitchMode(timer.mode === 'focus' ? 'break' : 'focus'),
  })

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <h1 className="text-center text-xs font-medium text-gray-700 dark:text-gray-100 tracking-widest uppercase">
          ColoredNoiseTimer
        </h1>

        {/* タイマーセクション */}
        <div className="flex flex-col gap-4">
          <ModeToggle mode={timer.mode} onSwitch={handleSwitchMode} />

          <div className="flex flex-col gap-1">
            <TimerDisplay
                seconds={timer.remainingSeconds}
                totalSeconds={timer.totalSeconds}
                mode={timer.mode}
              />
            <TimerSettings
              focusMinutes={focusMinutes}
              breakMinutes={breakMinutes}
              endSoundEnabled={endSoundEnabled}
              autoStart={autoStart}
              onFocusChange={setFocusMinutes}
              onBreakChange={setBreakMinutes}
              onEndSoundChange={setEndSoundEnabled}
              onAutoStartChange={setAutoStart}
            />
          </div>

          <SessionCounter count={displayCount} />

          <TimerControls
            isRunning={timer.isRunning}
            onStart={handleTimerStart}
            onStop={handleTimerStop}
            onReset={handleTimerReset}
          />

          <p className="text-center text-xs text-gray-600 dark:text-gray-100 select-none mt-2">
            ショートカット<br />
            スペース : 開始/停止 &nbsp;&nbsp; R : リセット &nbsp;&nbsp; M : モード切替
          </p>
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
