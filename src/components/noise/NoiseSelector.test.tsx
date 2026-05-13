import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoiseSelector } from './NoiseSelector'
import { NOISE_TYPES } from '@/lib/constants'

describe('NoiseSelector', () => {
  it('6種類のノイズボタンが表示される', () => {
    render(<NoiseSelector selected="White Noise" onChange={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(6)
  })

  it('全ノイズ名がaria-labelに設定されている', () => {
    render(<NoiseSelector selected="White Noise" onChange={vi.fn()} />)
    NOISE_TYPES.forEach((type) => {
      expect(screen.getByRole('button', { name: type })).toBeInTheDocument()
    })
  })

  it('選択中のボタンがaria-pressed=true', () => {
    render(<NoiseSelector selected="Pink Noise" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Pink Noise' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('未選択のボタンがaria-pressed=false', () => {
    render(<NoiseSelector selected="White Noise" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Pink Noise' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('別のノイズをクリックするとonChangeが呼ばれる', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<NoiseSelector selected="White Noise" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Blue Noise' }))
    expect(onChange).toHaveBeenCalledWith('Blue Noise')
  })
})
