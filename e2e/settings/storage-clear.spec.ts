import { expect, test, type Page } from '@playwright/test'

import { E2E_ENV } from 'e2e/config'
import { getAppDbName, readStores } from 'e2e/shared/indexed-db'

const MEDIA_STORE_NAME = 'media'

const buildStorageUser = () => {
  const suffix = Date.now().toString(36)

  return {
    nickname: `pw-storage-${suffix}`,
    email: `pw-storage-${suffix}@example.com`
  }
}

const signInWithProvider = async (page: Page) => {
  const { nickname, email } = buildStorageUser()
  const response = await page.request.post(`${E2E_ENV.PLAYWRIGHT_API_URL}/auth/provider-login`, {
    data: {
      nickname,
      email,
      provider: 'google'
    }
  })

  expect(response.ok()).toBeTruthy()
}

const openStorageSettings = async (page: Page) => {
  await page.goto('/app/settings/storage')
  await expect(page).toHaveURL(/\/app\/settings\/storage/)
}

const seedMediaCache = async (page: Page, dbName: string, ids: string[]) => {
  await page.evaluate(
    ({ dbName, ids, storeName }) => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName)

        request.onerror = () => reject(request.error?.message ?? 'Failed to open IndexedDB')
        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction(storeName, 'readwrite')
          const store = transaction.objectStore(storeName)

          transaction.onerror = () => reject(transaction.error?.message ?? 'Failed to seed media cache')
          transaction.oncomplete = () => {
            db.close()
            resolve(null)
          }

          ids.forEach((id) => {
            store.put({
              id,
              blob: new Blob([id], { type: 'text/plain' }),
              contentType: 'text/plain',
              lastChecked: Date.now(),
              status: 'ready'
            })
          })
        }
      })
    },
    { dbName, ids, storeName: MEDIA_STORE_NAME }
  )
}

const getCachedMedia = async (page: Page, dbName: string) => {
  const stores = await readStores(page, dbName, [MEDIA_STORE_NAME])

  return stores[MEDIA_STORE_NAME]
}

test.describe('settings storage', () => {
  test('clears downloaded media cache', async ({ page }) => {
    await signInWithProvider(page)
    await openStorageSettings(page)

    const dbName = await getAppDbName(page)
    const cachedMediaIds = ['storage-clear-e2e-media-1', 'storage-clear-e2e-media-2']

    await seedMediaCache(page, dbName, cachedMediaIds)

    const seededMedia = await getCachedMedia(page, dbName)

    cachedMediaIds.forEach((id) => {
      expect(seededMedia).toEqual(expect.arrayContaining([expect.objectContaining({ id })]))
    })

    const clearCacheCard = page.locator('.settings-card').filter({
      has: page.getByRole('heading', { name: 'Clear cache', exact: true })
    })

    await expect(clearCacheCard.getByText('Media', { exact: true })).toBeVisible()
    await clearCacheCard.getByRole('button', { name: 'Clear', exact: true }).click()

    await expect
      .poll(async () => {
        const media = await getCachedMedia(page, dbName)

        return cachedMediaIds.every((id) => media.every((item) => item.id !== id))
      })
      .toBe(true)
  })
})
