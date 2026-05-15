import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

function setup() {
  const onStartStop = vi.fn()
  const onReset = vi.fn()
  const onSwitchMode = vi.fn()
  renderHook(() => useKeyboardShortcuts({ onStartStop, onReset, onSwitchMode }))
  return { onStartStop, onReset, onSwitchMode }
}

describe('useKeyboardShortcuts', () => {
  it('スペースキーで onStartStop が呼ばれる', () => {
    const { onStartStop } = setup()
    fireEvent.keyDown(window, { key: ' ' })
    expect(onStartStop).toHaveBeenCalledTimes(1)
  })

  it('R キーで onReset が呼ばれる', () => {
    const { onReset } = setup()
    fireEvent.keyDown(window, { key: 'r' })
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('大文字 R でも onReset が呼ばれる', () => {
    const { onReset } = setup()
    fireEvent.keyDown(window, { key: 'R' })
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('M キーで onSwitchMode が呼ばれる', () => {
    const { onSwitchMode } = setup()
    fireEvent.keyDown(window, { key: 'm' })
    expect(onSwitchMode).toHaveBeenCalledTimes(1)
  })

  it('大文字 M でも onSwitchMode が呼ばれる', () => {
    const { onSwitchMode } = setup()
    fireEvent.keyDown(window, { key: 'M' })
    expect(onSwitchMode).toHaveBeenCalledTimes(1)
  })

  it('Ctrl+Space では発火しない', () => {
    const { onStartStop } = setup()
    fireEvent.keyDown(window, { key: ' ', ctrlKey: true })
    expect(onStartStop).not.toHaveBeenCalled()
  })

  it('Meta+R では発火しない', () => {
    const { onReset } = setup()
    fireEvent.keyDown(window, { key: 'r', metaKey: true })
    expect(onReset).not.toHaveBeenCalled()
  })

  it('input にフォーカスがあるときは発火しない', () => {
    const { onStartStop, onReset, onSwitchMode } = setup()
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    fireEvent.keyDown(input, { key: ' ' })
    fireEvent.keyDown(input, { key: 'r' })
    fireEvent.keyDown(input, { key: 'm' })
    expect(onStartStop).not.toHaveBeenCalled()
    expect(onReset).not.toHaveBeenCalled()
    expect(onSwitchMode).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })

  it('アンマウント時にイベントリスナーが削除される', () => {
    const { onStartStop, unmount } = (() => {
      const onStartStop = vi.fn()
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({ onStartStop, onReset: vi.fn(), onSwitchMode: vi.fn() })
      )
      return { onStartStop, unmount }
    })()
    unmount()
    fireEvent.keyDown(window, { key: ' ' })
    expect(onStartStop).not.toHaveBeenCalled()
  })
})
