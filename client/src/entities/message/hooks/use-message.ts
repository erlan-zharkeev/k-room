import { useLiveQuery } from 'dexie-react-hooks'

import type { DbMessageType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useMessage = () => {
  const messages = useLiveQuery(async () => {
    return await (db.messages.toArray() as Promise<DbMessageType[]>)
  }, []) ?? []

  return {
    messages,
    isMessageExist: (id: string) => Boolean(messages?.some(c => c.id === id)),
    getMessageById: (id: string) => messages.find((message) => message.id === id),
    putMessage: async (payload: DbMessageType) => await db.messages.put(payload),
    updateMessage: async (id: string, patch: Partial<DbMessageType>) => {
      await db.messages.update(id, patch)
    },
    reset: () => db.messages.clear()
  }
}
