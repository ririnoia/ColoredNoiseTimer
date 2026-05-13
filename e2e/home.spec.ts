import { test, expect } from '@playwright/test'

test.describe('ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ページが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /colorednoisetimer/i })).toBeVisible()
  })

  test('25:00のタイマーが表示される', async ({ page }) => {
    await expect(page.getByText('25:00')).toBeVisible()
  })

  test('タイマーを開始できる', async ({ page }) => {
    await page.getByRole('button', { name: '開始' }).click()
    await expect(page.getByRole('button', { name: '停止' })).toBeVisible()
  })

  test('タイマーを停止できる', async ({ page }) => {
    await page.getByRole('button', { name: '開始' }).click()
    await page.getByRole('button', { name: '停止' }).click()
    await expect(page.getByRole('button', { name: '開始' })).toBeVisible()
  })

  test('リセットで25:00に戻る', async ({ page }) => {
    await page.getByRole('button', { name: '開始' }).click()
    await page.waitForTimeout(2000)
    await page.getByRole('button', { name: 'リセット' }).click()
    await expect(page.getByText('25:00')).toBeVisible()
  })

  test('休憩モードに切り替えると05:00が表示される', async ({ page }) => {
    await page.getByRole('button', { name: '休憩' }).click()
    await expect(page.getByText('05:00')).toBeVisible()
  })

  test('選択中のモードをクリックしてもタイマーがリセットされない', async ({ page }) => {
    await page.getByRole('button', { name: '開始' }).click()
    await page.waitForTimeout(1500)
    await page.getByRole('button', { name: '集中' }).click()
    await expect(page.getByRole('button', { name: '停止' })).toBeVisible()
  })

  test('ノイズ再生ボタンを押せる', async ({ page }) => {
    await page.getByRole('button', { name: 'White Noise を再生' }).click()
    await expect(page.getByRole('button', { name: 'White Noise を停止' })).toBeVisible()
  })

  test('ノイズを停止できる', async ({ page }) => {
    await page.getByRole('button', { name: 'White Noise を再生' }).click()
    await page.getByRole('button', { name: 'White Noise を停止' }).click()
    await expect(page.getByRole('button', { name: 'White Noise を再生' })).toBeVisible()
  })

  test('音量スライダーを操作できる', async ({ page }) => {
    const slider = page.getByRole('slider', { name: '音量' })
    await expect(slider).toBeVisible()
    await slider.fill('80')
    await expect(slider).toHaveValue('80')
  })

  test('集中時間を変更できる', async ({ page }) => {
    const input = page.getByLabel('集中')
    await input.fill('30')
    await expect(input).toHaveValue('30')
  })

  test('スマホサイズで主要操作が表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('button', { name: '開始' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'White Noise を再生' })).toBeVisible()
    await expect(page.getByRole('slider', { name: '音量' })).toBeVisible()
  })
})
