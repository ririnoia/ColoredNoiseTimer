import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from './TimerDisplay'

describe('TimerDisplay', () => {
  it('0秒を 00:00 で表示する', () => {
    render(<TimerDisplay seconds={0} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('1500秒を 25:00 で表示する', () => {
    render(<TimerDisplay seconds={1500} />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('300秒を 05:00 で表示する', () => {
    render(<TimerDisplay seconds={300} />)
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('time要素として描画される', () => {
    render(<TimerDisplay seconds={65} />)
    expect(screen.getByText('01:05').tagName.toLowerCase()).toBe('time')
  })
})
