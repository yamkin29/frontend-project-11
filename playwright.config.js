import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'npm run preview:e2e',
    port: 4173,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
    locale: 'ru-RU',
  },
})
