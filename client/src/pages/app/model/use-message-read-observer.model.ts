import type { IEventChangeMessageStatus, SocketActionsType } from 'global-shared'
import { onBeforeUnmount, shallowRef, watch, type ComputedRef, type Ref } from 'vue'

import { socket } from 'src/shared/api'
import type { DbMessageType } from 'src/shared/lib'

import { MESSAGE_READ_VISIBILITY_THRESHOLD } from '../config/constants'

export const useMessageReadObserver = (
  roomId: Ref<string>,
  messages: ComputedRef<DbMessageType[]>,
  scrollElement: Ref<HTMLElement | null>
) => {
  const observer = shallowRef<IntersectionObserver | null>(null)
  const messageElements = new Map<string, Element>()
  const markedMessageIds = new Set<string>()
  let observerRoot: HTMLElement | null = null

  const markMessageAsRead = (messageId: string) => {
    const message = messages.value.find(({ id }) => id === messageId)

    if (
      !roomId.value ||
      !message ||
      message.isSelf ||
      message.status !== 'delivered' ||
      markedMessageIds.has(messageId)
    ) {
      return
    }

    markedMessageIds.add(messageId)

    const payload: IEventChangeMessageStatus = {
      roomId: roomId.value,
      messageId,
      status: 'read'
    }

    socket.emit<SocketActionsType>('change-message-status', payload)
  }

  const handleEntries = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
      if (!isIntersecting || intersectionRatio < MESSAGE_READ_VISIBILITY_THRESHOLD) return

      const messageId = target.getAttribute('data-message-id')

      if (messageId) {
        markMessageAsRead(messageId)
      }
    })
  }

  const resetObserver = () => {
    observer.value?.disconnect()
    observerRoot = scrollElement.value
    observer.value = new IntersectionObserver(handleEntries, {
      root: observerRoot,
      threshold: MESSAGE_READ_VISIBILITY_THRESHOLD
    })
    messageElements.forEach((element) => observer.value?.observe(element))
  }

  const ensureObserver = () => {
    if (observer.value && observerRoot === scrollElement.value) return

    resetObserver()
  }

  const observeMessageElement = (element: Element | null, messageId: string) => {
    const currentElement = messageElements.get(messageId)

    if (currentElement && currentElement !== element) {
      observer.value?.unobserve(currentElement)
      messageElements.delete(messageId)
    }

    if (!element) return

    ensureObserver()
    element.setAttribute('data-message-id', messageId)
    messageElements.set(messageId, element)
    observer.value?.observe(element)
  }

  const disconnectReadObserver = () => {
    observer.value?.disconnect()
    observer.value = null
    observerRoot = null
    messageElements.clear()
  }

  watch(roomId, () => {
    markedMessageIds.clear()
    disconnectReadObserver()
  })

  watch(messages, () => {
    const messageIds = new Set(messages.value.map(({ id }) => id))

    messageElements.forEach((element, messageId) => {
      if (messageIds.has(messageId)) return

      observer.value?.unobserve(element)
      messageElements.delete(messageId)
    })
  })

  onBeforeUnmount(disconnectReadObserver)

  return {
    observeMessageElement,
    disconnectReadObserver
  }
}
