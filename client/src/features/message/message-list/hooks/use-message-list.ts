import { MutableRefObject, useEffect, useRef } from 'react'

import { IChatRoom, IEventChangeMessageStatus, SocketActionsType } from 'common-types'
import useDynamicRefs from 'use-dynamic-refs'

import { useMessage } from 'src/entities/message'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'

import { MESSAGE_LIST_OBSERVER_BIND_DELAY } from '../config'

type MessageElementRef = MutableRefObject<HTMLDivElement | null>
type DynamicRefsTuple = [(id: string) => MessageElementRef | undefined, (id: string) => (instance: HTMLDivElement | null) => void]

export const useMessageList = (selectedChatRoom: IChatRoom) => {
  const [getRef, setRef] = useDynamicRefs() as unknown as DynamicRefsTuple
  const { startTimeout } = useTimeout()
  const { getMessageById } = useMessage()
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    startTimeout(() => setRefToMessages(), MESSAGE_LIST_OBSERVER_BIND_DELAY)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [selectedChatRoom])

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || !selectedChatRoom) return

      const messageId = entry.target.getAttribute('id')
      if (!messageId) return

      const message = getMessageById(messageId)
      if (!message) return

      const messageRead = message?.status === 'read'
      const isSelfMessage = Boolean(message?.isSelf)

      if (!messageId || messageRead || isSelfMessage) return

      const payload: IEventChangeMessageStatus = {
        roomId: selectedChatRoom.id,
        messageId,
        status: 'read'
      }

      socket.emit<SocketActionsType>('change-message-status', payload)
    })
  }

  const getObserver = () => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(observerCallback, { threshold: 0.5 })
    }

    return observerRef.current
  }

  const setRefToMessages = () => {
    const observer = getObserver()

    selectedChatRoom?.messages.forEach((messageId) => {
      const el = getRef(messageId)
      if (!el?.current) return

      el.current.setAttribute('id', messageId)
      observer.observe(el.current)
    })
  }

  return { setRef }
}
