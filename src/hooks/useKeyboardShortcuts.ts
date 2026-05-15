import { useEffect, useRef } from 'react'

interface ShortcutHandlers {
  onStartStop: () => void
  onReset: () => void
  onSwitchMode: () => void
}

export function useKeyboardShortcuts({ onStartStop, onReset, onSwitchMode }: ShortcutHandlers) {
  // refで最新のハンドラを保持し、イベントリスナーの付け直しを不要にする
  const onStartStopRef = useRef(onStartStop)
  const onResetRef = useRef(onReset)
  const onSwitchModeRef = useRef(onSwitchMode)

  useEffect(() => { onStartStopRef.current = onStartStop }, [onStartStop])
  useEffect(() => { onResetRef.current = onReset }, [onReset])
  useEffect(() => { onSwitchModeRef.current = onSwitchMode }, [onSwitchMode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // input/textarea 入力中はショートカットを無効化
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      // 修飾キー付きは無効化（ブラウザショートカットを妨げない）
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          onStartStopRef.current()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          onResetRef.current()
          break
        case 'm':
        case 'M':
          e.preventDefault()
          onSwitchModeRef.current()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
