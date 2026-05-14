import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotification } from './useNotification'

const mockRequestPermission = vi.fn()
const MockNotification = vi.fn()

describe('useNotification', () => {
  beforeEach(() => {
    vi.stubGlobal('Notification', Object.assign(MockNotification, {
      permission: 'default' as NotificationPermission,
      requestPermission: mockRequestPermission,
    }))
    MockNotification.mockClear()
    mockRequestPermission.mockClear()
    mockRequestPermission.mockResolvedValue('granted')
  })

  it('requestPermission: permissionがdefaultのとき許可リクエストを送る', async () => {
    const { result } = renderHook(() => useNotification())
    await act(async () => { await result.current.requestPermission() })
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
  })

  it('requestPermission: permissionがgrantedのときリクエストを送らない', async () => {
    Object.assign(MockNotification, { permission: 'granted' })
    const { result } = renderHook(() => useNotification())
    await act(async () => { await result.current.requestPermission() })
    expect(mockRequestPermission).not.toHaveBeenCalled()
  })

  it('requestPermission: permissionがdeniedのときリクエストを送らない', async () => {
    Object.assign(MockNotification, { permission: 'denied' })
    const { result } = renderHook(() => useNotification())
    await act(async () => { await result.current.requestPermission() })
    expect(mockRequestPermission).not.toHaveBeenCalled()
  })

  it('notify: permissionがgrantedのときNotificationを作成する', () => {
    Object.assign(MockNotification, { permission: 'granted' })
    const { result } = renderHook(() => useNotification())
    result.current.notify('テスト通知', { body: '本文' })
    expect(MockNotification).toHaveBeenCalledWith('テスト通知', { body: '本文' })
  })

  it('notify: permissionがdeniedのときNotificationを作成しない', () => {
    Object.assign(MockNotification, { permission: 'denied' })
    const { result } = renderHook(() => useNotification())
    result.current.notify('テスト通知')
    expect(MockNotification).not.toHaveBeenCalled()
  })

  it('notify: permissionがdefaultのときNotificationを作成しない', () => {
    const { result } = renderHook(() => useNotification())
    result.current.notify('テスト通知')
    expect(MockNotification).not.toHaveBeenCalled()
  })

  it('notify: コンストラクタがthrowしてもエラーを伝播させない', () => {
    Object.assign(MockNotification, { permission: 'granted' })
    MockNotification.mockImplementationOnce(() => { throw new TypeError('Not supported') })
    const { result } = renderHook(() => useNotification())
    expect(() => result.current.notify('テスト通知')).not.toThrow()
  })
})
