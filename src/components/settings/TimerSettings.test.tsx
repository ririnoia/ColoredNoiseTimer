import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerSettings } from './TimerSettings'

const defaultProps = {
  focusMinutes: 25,
  breakMinutes: 5,
  endSoundEnabled: true,
  autoStart: false,
  onFocusChange: vi.fn(),
  onBreakChange: vi.fn(),
  onEndSoundChange: vi.fn(),
  onAutoStartChange: vi.fn(),
}

describe('TimerSettings', () => {
  it('集中時間・休憩時間・終了音・自動開始が表示される', () => {
    render(<TimerSettings {...defaultProps} />)
    expect(screen.getByLabelText('集中')).toBeInTheDocument()
    expect(screen.getByLabelText('休憩')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: '終了音' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: '自動開始' })).toBeInTheDocument()
  })

  it('集中時間の初期値が表示される', () => {
    render(<TimerSettings {...defaultProps} />)
    expect(screen.getByLabelText('集中')).toHaveValue(25)
  })

  it('休憩時間の初期値が表示される', () => {
    render(<TimerSettings {...defaultProps} />)
    expect(screen.getByLabelText('休憩')).toHaveValue(5)
  })

  it('終了音ONのときswitchがaria-checked=true', () => {
    render(<TimerSettings {...defaultProps} endSoundEnabled={true} />)
    expect(screen.getByRole('switch', { name: '終了音' })).toHaveAttribute('aria-checked', 'true')
  })

  it('終了音OFFのときswitchがaria-checked=false', () => {
    render(<TimerSettings {...defaultProps} endSoundEnabled={false} />)
    expect(screen.getByRole('switch', { name: '終了音' })).toHaveAttribute('aria-checked', 'false')
  })

  it('終了音トグルクリックでonEndSoundChangeが呼ばれる', async () => {
    const onEndSoundChange = vi.fn()
    const user = userEvent.setup()
    render(<TimerSettings {...defaultProps} onEndSoundChange={onEndSoundChange} />)
    await user.click(screen.getByRole('switch', { name: '終了音' }))
    expect(onEndSoundChange).toHaveBeenCalledWith(false)
  })

  it('自動開始OFFのときswitchがaria-checked=false', () => {
    render(<TimerSettings {...defaultProps} autoStart={false} />)
    expect(screen.getByRole('switch', { name: '自動開始' })).toHaveAttribute('aria-checked', 'false')
  })

  it('自動開始ONのときswitchがaria-checked=true', () => {
    render(<TimerSettings {...defaultProps} autoStart={true} />)
    expect(screen.getByRole('switch', { name: '自動開始' })).toHaveAttribute('aria-checked', 'true')
  })

  it('自動開始トグルクリックでonAutoStartChangeが呼ばれる', async () => {
    const onAutoStartChange = vi.fn()
    const user = userEvent.setup()
    render(<TimerSettings {...defaultProps} onAutoStartChange={onAutoStartChange} />)
    await user.click(screen.getByRole('switch', { name: '自動開始' }))
    expect(onAutoStartChange).toHaveBeenCalledWith(true)
  })

  it('集中時間を変更するとonFocusChangeが呼ばれる', () => {
    const onFocusChange = vi.fn()
    render(<TimerSettings {...defaultProps} onFocusChange={onFocusChange} />)
    fireEvent.change(screen.getByLabelText('集中'), { target: { value: '30' } })
    expect(onFocusChange).toHaveBeenCalledWith(30)
  })

  it('休憩時間を変更するとonBreakChangeが呼ばれる', () => {
    const onBreakChange = vi.fn()
    render(<TimerSettings {...defaultProps} onBreakChange={onBreakChange} />)
    fireEvent.change(screen.getByLabelText('休憩'), { target: { value: '10' } })
    expect(onBreakChange).toHaveBeenCalledWith(10)
  })
})
