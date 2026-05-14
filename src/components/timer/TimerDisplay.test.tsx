import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from './TimerDisplay'

const defaultProps = { seconds: 0, totalSeconds: 1500, mode: 'focus' as const }

describe('TimerDisplay', () => {
  it('0秒を 00:00 で表示する', () => {
    render(<TimerDisplay {...defaultProps} seconds={0} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('1500秒を 25:00 で表示する', () => {
    render(<TimerDisplay {...defaultProps} seconds={1500} />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('300秒を 05:00 で表示する', () => {
    render(<TimerDisplay {...defaultProps} seconds={300} totalSeconds={300} />)
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('time要素として描画される', () => {
    render(<TimerDisplay {...defaultProps} seconds={65} />)
    expect(screen.getByText('01:05').tagName.toLowerCase()).toBe('time')
  })

  it('progress ringのSVGが描画される', () => {
    const { container } = render(<TimerDisplay {...defaultProps} seconds={750} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelectorAll('circle')).toHaveLength(2)
  })

  it('breakモードでも描画される', () => {
    render(<TimerDisplay seconds={300} totalSeconds={300} mode="break" />)
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('seconds > totalSeconds（実行中に時間短縮）でもエラーにならない', () => {
    // progress が 1 を超えないことで dashOffset が負にならない
    const { container } = render(
      <TimerDisplay seconds={1200} totalSeconds={900} mode="focus" />
    )
    const progressCircle = container.querySelectorAll('circle')[1]
    const dashOffset = parseFloat(progressCircle?.getAttribute('stroke-dashoffset') ?? '0')
    expect(dashOffset).toBeGreaterThanOrEqual(0)
  })
})
