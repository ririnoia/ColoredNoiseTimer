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
      // Fix2: キーリピート（長押し）は無視してトグル誤動作を防ぐ
      if (e.repeat) return

      // Fix1: フォーカスがインタラクティブ要素にある場合は無効化
      // button にフォーカスがある状態で Space を押すとネイティブのボタン活性化を
      // 抑制してしまうため、button/a/select/contenteditable も除外する
      // instanceof Element でガードし、window/document が target の場合も安全に扱う
      const target = e.target
      if (target instanceof Element &&
          target.matches('input, textarea, select, button, a, [contenteditable]')) return

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
