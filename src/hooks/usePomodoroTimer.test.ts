import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePomodoroTimer } from './usePomodoroTimer'

describe('usePomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.title = 'ColoredNoiseTimer'
  })

  const defaultOpts = { focusMinutes: 25, breakMinutes: 5, endSoundEnabled: false }

  it('初期状態: focusモード・停止中・25分表示', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    expect(result.current.mode).toBe('focus')
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingSeconds).toBe(1500)
  })

  it('start()でタイマーが開始する', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    expect(result.current.isRunning).toBe(true)
  })

  it('stop()でタイマーが停止する', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    act(() => { result.current.stop() })
    expect(result.current.isRunning).toBe(false)
  })

  it('1秒ごとにカウントダウンする', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.remainingSeconds).toBe(1497)
  })

  it('reset()で停止し残り時間が初期値に戻る', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(5000) })
    act(() => { result.current.reset() })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingSeconds).toBe(1500)
  })

  it('タイマー完了後にstart()で再開できる', () => {
    const { result } = renderHook(() => usePomodoroTimer({ ...defaultOpts, focusMinutes: 1 }))
    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(60_000) })
    expect(result.current.isRunning).toBe(false)
    act(() => { result.current.start() })
    expect(result.current.isRunning).toBe(true)
    expect(result.current.remainingSeconds).toBe(60)
  })

  it('タイマー完了時にonEndが呼ばれる', () => {
    const onEnd = vi.fn()
    const { result } = renderHook(() =>
      usePomodoroTimer({ focusMinutes: 1, breakMinutes: 5, endSoundEnabled: false, onEnd })
    )
    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(60_000) })
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(result.current.isRunning).toBe(false)
    // 完了後はremainingが0になる（resetするまで0のまま）
    expect(result.current.remainingSeconds).toBe(0)
  })

  it('switchMode()でbreakに切り替わり残り時間がリセットされる', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.switchMode('break') })
    expect(result.current.mode).toBe('break')
    expect(result.current.remainingSeconds).toBe(300)
    expect(result.current.isRunning).toBe(false)
  })

  it('実行中にswitchMode()でタイマーが停止しモードが切り替わる', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    act(() => { result.current.switchMode('break') })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.mode).toBe('break')
  })

  it('実行中にdocument.titleが更新される', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    expect(document.title).toMatch(/Focus/)
    expect(document.title).toMatch(/ColoredNoiseTimer/)
  })

  it('停止中はdocument.titleがColoredNoiseTimerに戻る', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    act(() => { result.current.stop() })
    expect(document.title).toBe('ColoredNoiseTimer')
  })

  it('アンマウント時にdocument.titleがリストアされる', () => {
    const { result, unmount } = renderHook(() => usePomodoroTimer(defaultOpts))
    act(() => { result.current.start() })
    unmount()
    expect(document.title).toBe('ColoredNoiseTimer')
  })
})
