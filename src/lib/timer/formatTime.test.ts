import { describe, it, expect } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('0秒を 00:00 に変換する', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('1秒を 00:01 に変換する', () => {
    expect(formatTime(1)).toBe('00:01')
  })

  it('60秒を 01:00 に変換する', () => {
    expect(formatTime(60)).toBe('01:00')
  })

  it('65秒を 01:05 に変換する', () => {
    expect(formatTime(65)).toBe('01:05')
  })

  it('25分（1500秒）を 25:00 に変換する', () => {
    expect(formatTime(1500)).toBe('25:00')
  })

  it('59分59秒（3599秒）を 59:59 に変換する', () => {
    expect(formatTime(3599)).toBe('59:59')
  })
})
