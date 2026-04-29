import { expect, test, type Page } from '@playwright/test'

import { LOGIN_FIXTURE_USER } from './fixtures'

const AUTH_COOKIE_NAMES = ['jwt', 'refresh-jwt', 'device-id'] as const
const RESET_STORE_NAMES = ['contacts', 'media', 'chat-rooms', 'info-notifications'] as const

type DbRow = {
  id?: string
  email?: string
  username?: string
  role?: string
}

type StoreRows = Record<string, DbRow[]>

const login = async (page: Page) => {
  await page.goto('/authorize/login')

  const emailInput = page.getByPlaceholder('Enter your email')
  const passwordInput = page.getByPlaceholder('Enter your password')
  const submitButton = page.getByRole('button', { name: 'Login', exact: true })

  await emailInput.click()
  await emailInput.pressSequentially(LOGIN_FIXTURE_USER.email)
  await emailInput.blur()

  await passwordInput.click()
  await passwordInput.pressSequentially(LOGIN_FIXTURE_USER.password)
  await passwordInput.blur()

  await expect(submitButton).toBeEnabled()
  await submitButton.click()
  await page.waitForURL('**/app/**')
}

const getAppDbName = async (page: Page) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const dbName = await page.evaluate(async () => {
      if (typeof indexedDB.databases !== 'function') return ''

      const databases = await indexedDB.databases()

      for (const { name } of databases) {
        if (!name) continue

        const isAppDb = await new Promise<boolean>((resolve) => {
          const request = indexedDB.open(name)

          request.onerror = () => resolve(false)
          request.onsuccess = () => {
            const db = request.result
            const result = db.objectStoreNames.contains('user') && db.objectStoreNames.contains('settings')

            db.close()
            resolve(result)
          }
        })

        if (isAppDb) {
          return name
        }
      }

      return ''
    })

    if (dbName) {
      return dbName
    }

    await page.waitForTimeout(250)
  }

  throw new Error('App IndexedDB was not created')
}

const readStores = async (page: Page, dbName: string, storeNames: readonly string[]) => {
  return page.evaluate(({ dbName, storeNames }) => {
    return new Promise<StoreRows>((resolve, reject) => {
      const request = indexedDB.open(dbName)

      request.onerror = () => reject(request.error?.message ?? 'Failed to open IndexedDB')
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(storeNames, 'readonly')
        const result: StoreRows = {}
        let pending = storeNames.length

        storeNames.forEach((storeName) => {
          const getAllRequest = transaction.objectStore(storeName).getAll()

          getAllRequest.onerror = () => reject(getAllRequest.error?.message ?? `Failed to read ${storeName}`)
          getAllRequest.onsuccess = () => {
            result[storeName] = getAllRequest.result
            pending -= 1

            if (!pending) {
              db.close()
              resolve(result)
            }
          }
        })
      }
    })
  }, { dbName, storeNames })
}

const seedStores = async (page: Page, dbName: string, items: { storeName: string, id: string }[]) => {
  await page.evaluate(({ dbName, items }) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName)

      request.onerror = () => reject(request.error?.message ?? 'Failed to open IndexedDB')
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(items.map(({ storeName }) => storeName), 'readwrite')

        transaction.onerror = () => reject(transaction.error?.message ?? 'Failed to seed IndexedDB')
        transaction.oncomplete = () => {
          db.close()
          resolve(null)
        }

        items.forEach(({ storeName, id }) => {
          transaction.objectStore(storeName).put({ id })
        })
      }
    })
  }, { dbName, items })
}

test.describe('logout', () => {
  test('clears auth cookies and client session data', async ({ page }) => {
    await login(page)

    const logoutButton = page.getByRole('button', { name: 'Logout' })
    const dbName = await getAppDbName(page)
    const seededItems = RESET_STORE_NAMES.map((storeName) => ({
      storeName,
      id: `logout-e2e-${storeName}`
    }))

    await expect(logoutButton).toBeVisible()

    const storesBeforeLogout = await readStores(page, dbName, ['user'])
    const [userBeforeLogout] = storesBeforeLogout.user

    expect(userBeforeLogout).toMatchObject({
      email: LOGIN_FIXTURE_USER.email,
      username: expect.any(String)
    })
    expect(userBeforeLogout.id).toBeTruthy()

    await seedStores(page, dbName, seededItems)

    const seededStores = await readStores(page, dbName, RESET_STORE_NAMES)

    seededItems.forEach(({ storeName, id }) => {
      expect(seededStores[storeName]).toEqual(
        expect.arrayContaining([expect.objectContaining({ id })])
      )
    })

    await logoutButton.click()

    await page.waitForURL('**/authorize/login')
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
    await expect.poll(async () => {
      const cookieNames = new Set((await page.context().cookies()).map(({ name }) => name))

      return AUTH_COOKIE_NAMES.every((cookieName) => !cookieNames.has(cookieName))
    }).toBe(true)

    const storesAfterLogout = await readStores(page, dbName, ['user', ...RESET_STORE_NAMES])
    const [userAfterLogout] = storesAfterLogout.user

    expect(userAfterLogout).toMatchObject({
      id: '',
      role: 'user',
      email: '',
      username: ''
    })

    RESET_STORE_NAMES.forEach((storeName) => {
      expect(storesAfterLogout[storeName]).toEqual([])
    })
  })
})
