import type { Message } from 'global-shared'
import { shallowRef } from 'vue'

import { db, dexieCollectionStore } from 'src/shared/lib'

const messageStore = dexieCollectionStore<Message>(db.messages)
const messageById = shallowRef(new Map<string, Message>())

const rememberMessages = (messages: readonly Message[]) => {
  if (!messages.length) return

  const nextMessageById = new Map(messageById.value)

  messages.forEach((message) => {
    nextMessageById.set(message.id, message)
  })
  messageById.value = nextMessageById
}

const forgetMessages = (ids: readonly string[]) => {
  if (!ids.length) return

  const nextMessageById = new Map(messageById.value)

  ids.forEach((id) => {
    nextMessageById.delete(id)
  })
  messageById.value = nextMessageById
}

const updateCachedMessages = (updates: readonly { id: string; changes: Partial<Message> }[]) => {
  if (!updates.length) return

  const nextMessageById = new Map(messageById.value)

  updates.forEach(({ id, changes }) => {
    const currentMessage = nextMessageById.get(id)

    if (currentMessage) {
      nextMessageById.set(id, { ...currentMessage, ...changes })
    }
  })
  messageById.value = nextMessageById
}

const loadByIds = async (ids: readonly string[]) => {
  const missingIds = [...new Set(ids)].filter((id) => !messageById.value.has(id))

  if (missingIds.length) {
    const messages = (await messageStore.bulkGet(missingIds)).filter((message): message is Message => Boolean(message))

    rememberMessages(messages)
  }

  return ids.flatMap((id) => {
    const message = messageById.value.get(id)

    return message ? [message] : []
  })
}

export const useMessage = () => {
  const getById = (id: string) => messageById.value.get(id)
  const isExist = (id: string) => messageById.value.has(id)

  const put: typeof messageStore.put = async (message) => {
    await messageStore.put(message)
    rememberMessages([message])
  }

  const bulkPut: typeof messageStore.bulkPut = async (messages) => {
    await messageStore.bulkPut(messages)
    rememberMessages(messages)
  }

  const update: typeof messageStore.update = async (id, changes) => {
    const updated = await messageStore.update(id, changes)

    if (updated) {
      updateCachedMessages([{ id, changes }])
    }

    return updated
  }

  const bulkUpdate: typeof messageStore.bulkUpdate = async (data) => {
    const updated = await messageStore.bulkUpdate(data)

    if (updated) {
      updateCachedMessages(data)
    }

    return updated
  }

  const mutate: typeof messageStore.mutate = async (id, mutator) => {
    const wasCached = messageById.value.has(id)

    await messageStore.mutate(id, mutator)

    if (!wasCached) return

    const message = await messageStore.get(id)

    if (message) {
      rememberMessages([message])
    }
  }

  const remove: typeof messageStore.remove = async (id) => {
    await messageStore.remove(id)
    forgetMessages([id])
  }

  const bulkDelete: typeof messageStore.bulkDelete = async (ids) => {
    await messageStore.bulkDelete(ids)
    forgetMessages(ids)
  }

  const reset: typeof messageStore.reset = async () => {
    await messageStore.reset()
    messageById.value = new Map()
  }

  return {
    messageById,
    getById,
    isExist,
    loadByIds,
    put,
    bulkPut,
    bulkUpdate,
    bulkDelete,
    update,
    mutate,
    remove,
    reset
  }
}
