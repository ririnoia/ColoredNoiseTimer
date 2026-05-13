import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeToggle } from './ModeToggle'

describe('ModeToggle', () => {
  it('集中・休憩ボタンが表示される', () => {
    render(<ModeToggle mode="focus" onSwitch={vi.fn()} />)
    expect(screen.getByRole('button', { name: '集中' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '休憩' })).toBeInTheDocument()
  })

  it('focusモードのとき集中ボタンがaria-pressed=true', () => {
    render(<ModeToggle mode="focus" onSwitch={vi.fn()} />)
    expect(screen.getByRole('button', { name: '集中' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '休憩' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('breakモードのとき休憩ボタンがaria-pressed=true', () => {
    render(<ModeToggle mode="break" onSwitch={vi.fn()} />)
    expect(screen.getByRole('button', { name: '休憩' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '集中' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('別のモードをクリックするとonSwitchが呼ばれる', async () => {
    const onSwitch = vi.fn()
    const user = userEvent.setup()
    render(<ModeToggle mode="focus" onSwitch={onSwitch} />)
    await user.click(screen.getByRole('button', { name: '休憩' }))
    expect(onSwitch).toHaveBeenCalledWith('break')
  })

  it('選択中のモードをクリックしてもonSwitchが呼ばれない', async () => {
    const onSwitch = vi.fn()
    const user = userEvent.setup()
    render(<ModeToggle mode="focus" onSwitch={onSwitch} />)
    await user.click(screen.getByRole('button', { name: '集中' }))
    expect(onSwitch).not.toHaveBeenCalled()
  })
})
