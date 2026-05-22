import type { Page } from '@playwright/test'

import type { IndexedDbSeedItem, IndexedDbStoresData } from './types'

export const getAppDbName = async (page: Page) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const dbName = await page.evaluate(async () => {
      const databases = await indexedDB.databases()

      for (const { name } of databases) {
        if (!name) continue

        const isAppDb = await new Promise<boolean>((resolve) => {
          const request = indexedDB.open(name)

          request.onerror = () => resolve(false)
          request.onsuccess = () => {
            const db = request.result
            const result = db.objectStoreNames.contains('settings') && db.objectStoreNames.contains('contacts')

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

export const readStores = async (page: Page, dbName: string, storeNames: readonly string[]) => {
  return page.evaluate(
    ({ dbName, storeNames }) => {
      return new Promise<IndexedDbStoresData>((resolve, reject) => {
        const request = indexedDB.open(dbName)

        request.onerror = () => reject(request.error?.message ?? 'Failed to open IndexedDB')
        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction([...storeNames], 'readonly')
          const result: IndexedDbStoresData = {}
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
    },
    { dbName, storeNames }
  )
}

export const seedStores = async (page: Page, dbName: string, items: IndexedDbSeedItem[]) => {
  await page.evaluate(
    ({ dbName, items }) => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName)

        request.onerror = () => reject(request.error?.message ?? 'Failed to open IndexedDB')
        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction(
            items.map(({ storeName }) => storeName),
            'readwrite'
          )

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
    },
    { dbName, items }
  )
}
