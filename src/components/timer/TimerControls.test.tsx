import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControls } from './TimerControls'

describe('TimerControls', () => {
  const noop = vi.fn()

  it('停止中は「開始」ボタンが表示される', () => {
    render(<TimerControls isRunning={false} onStart={noop} onStop={noop} onReset={noop} />)
    expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '停止' })).not.toBeInTheDocument()
  })

  it('実行中は「停止」ボタンが表示される', () => {
    render(<TimerControls isRunning={true} onStart={noop} onStop={noop} onReset={noop} />)
    expect(screen.getByRole('button', { name: '停止' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '開始' })).not.toBeInTheDocument()
  })

  it('リセットボタンが常に表示される', () => {
    render(<TimerControls isRunning={false} onStart={noop} onStop={noop} onReset={noop} />)
    expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument()
  })

  it('「開始」クリックでonStartが呼ばれる', async () => {
    const onStart = vi.fn()
    const user = userEvent.setup()
    render(<TimerControls isRunning={false} onStart={onStart} onStop={noop} onReset={noop} />)
    await user.click(screen.getByRole('button', { name: '開始' }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('「停止」クリックでonStopが呼ばれる', async () => {
    const onStop = vi.fn()
    const user = userEvent.setup()
    render(<TimerControls isRunning={true} onStart={noop} onStop={onStop} onReset={noop} />)
    await user.click(screen.getByRole('button', { name: '停止' }))
    expect(onStop).toHaveBeenCalledTimes(1)
  })

  it('「リセット」クリックでonResetが呼ばれる', async () => {
    const onReset = vi.fn()
    const user = userEvent.setup()
    render(<TimerControls isRunning={false} onStart={noop} onStop={noop} onReset={onReset} />)
    await user.click(screen.getByRole('button', { name: 'リセット' }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
