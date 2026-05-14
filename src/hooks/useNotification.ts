import { useCallback } from 'react'

export function useNotification() {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window

  const requestPermission = useCallback(async () => {
    if (!isSupported || Notification.permission !== 'default') return
    try {
      await Notification.requestPermission()
    } catch {
      // 一部の環境ではPromiseベースのAPIが未サポート
    }
  }, [isSupported])

  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || Notification.permission !== 'granted') return
    new Notification(title, options)
  }, [isSupported])

  return { requestPermission, notify }
}
