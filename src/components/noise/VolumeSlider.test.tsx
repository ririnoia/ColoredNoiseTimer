import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VolumeSlider } from './VolumeSlider'

describe('VolumeSlider', () => {
  it('音量ラベルが表示される', () => {
    render(<VolumeSlider volume={0.5} onChange={vi.fn()} />)
    expect(screen.getByLabelText('音量')).toBeInTheDocument()
  })

  it('volume=0.5のとき50と表示される', () => {
    render(<VolumeSlider volume={0.5} onChange={vi.fn()} />)
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('volume=0のとき0と表示される', () => {
    render(<VolumeSlider volume={0} onChange={vi.fn()} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('volume=1のとき100と表示される', () => {
    render(<VolumeSlider volume={1} onChange={vi.fn()} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('スライダーの値が正しく設定される', () => {
    render(<VolumeSlider volume={0.7} onChange={vi.fn()} />)
    expect(screen.getByRole('slider')).toHaveValue('70')
  })

  it('スライダー変更でonChangeが0-1スケールで呼ばれる', () => {
    const onChange = vi.fn()
    render(<VolumeSlider volume={0.5} onChange={onChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    const called = onChange.mock.calls[0][0] as number
    expect(called).toBeCloseTo(0.8, 5)
  })
})
