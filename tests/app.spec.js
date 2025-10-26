import { test, expect } from '@playwright/test'

test('can add rss and open preview', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('textbox', { name: /url/i }).fill('https://lorem-rss.hexlet.app/feed')
  await page.locator('#add-button').click()

  await expect(page.getByText('RSS успешно загружен')).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Фиды' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Посты' })).toBeVisible()

  const previewBtn = page.getByRole('button', { name: 'Просмотр' }).first()
  await previewBtn.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Закрыть' }).first()).toBeVisible()
})
