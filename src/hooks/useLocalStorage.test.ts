import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('localStorageが空のときデフォルト値を返す', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    await act(async () => {})
    expect(result.current[0]).toBe('default')
  })

  it('localStorageに値がある場合その値を返す', async () => {
    localStorage.setItem('test-key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    await act(async () => {})
    expect(result.current[0]).toBe('stored')
  })

  it('数値を正しく保存・復元する', async () => {
    localStorage.setItem('num-key', JSON.stringify(42))
    const { result } = renderHook(() => useLocalStorage('num-key', 0))
    await act(async () => {})
    expect(result.current[0]).toBe(42)
  })

  it('booleanを正しく保存・復元する', async () => {
    localStorage.setItem('bool-key', JSON.stringify(false))
    const { result } = renderHook(() => useLocalStorage('bool-key', true))
    await act(async () => {})
    expect(result.current[0]).toBe(false)
  })

  it('setValue()で値を変更するとlocalStorageに保存される', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    await act(async () => {})
    act(() => { result.current[1]('updated') })
    await act(async () => {})
    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated')
  })

  it('localStorageが壊れていてもデフォルト値を返す', async () => {
    localStorage.setItem('test-key', 'invalid json{{{')
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    await act(async () => {})
    expect(result.current[0]).toBe('default')
  })
})
