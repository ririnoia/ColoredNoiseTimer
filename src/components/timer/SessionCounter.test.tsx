import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SessionCounter } from './SessionCounter'

describe('SessionCounter', () => {
  it('0のとき「今日 0 ポモ完了」と表示される', () => {
    render(<SessionCounter count={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText(/ポモ完了/)).toBeInTheDocument()
  })

  it('3のとき「今日 3 ポモ完了」と表示される', () => {
    render(<SessionCounter count={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('カウントが大きくても表示される', () => {
    render(<SessionCounter count={12} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })
})
