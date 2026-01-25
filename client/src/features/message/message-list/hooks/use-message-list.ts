import { useEffect, useState } from 'react'

import { IChatRoom, IEventChangeMessageStatus, IMessage, SocketActionsType } from 'common-types'
import moment from 'moment'
import useDynamicRefs from 'use-dynamic-refs'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'
import { generateUUIDv4 } from 'src/shared/utils'

export const useMessageList = (selectedChatRoom: IChatRoom) => {
  // const [messages, setMessages] = useState<IMessage[]>([])
  const [getRef, setRef] = useDynamicRefs() as any
  // const { startTimeout } = useTimeout()

  useEffect(() => {
    // injectDateToMessages()
    // startTimeout(() => setRefToMessages(), 1500)
  }, [selectedChatRoom])

  const observerCallback = (entries: any[]) => {
    // entries.forEach((entry: any) => {
    //   if (!entry.isIntersecting || !selectedChatRoom) return
    //   const messageId = entry.target.getAttribute('id')
    //   const messageRead = Boolean(entry.target.querySelector('.message--read'))
    //   if (messageId.includes('time') || messageRead) return
    //   const payload: IEventChangeMessageStatus = {
    //     roomId: selectedChatRoom.id,
    //     messageId,
    //     status: 'read'
    //   }
    //   socket.emit<SocketActionsType>('change-message-status', payload)
    // })
  }

  // const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 })

  const setRefToMessages = () => {
    // selectedChatRoom?.messages.forEach((message) => {
    //   /** Use only strict validation without type casting */
    //   if (message.isSelf ?? message.isSelf === undefined) return
    //   const el = getRef(message.id)
    //   if (!el.current) return
    //   el.current.setAttribute('id', message.id)
    //   observer.observe(el.current)
    // })
  }

  // const injectDateToMessages = () => {
  //   let lastDate = ''
  //   const updatedMessagesWithDates: IMessage[] = []
  //   selectedChatRoom?.messages.forEach((message) => {
  //     const messageDate = moment(Number(message.createdAt)).format('LL').split(',')[0]
  //     if (messageDate !== lastDate && message.authorName !== 'system') {
  //       lastDate = messageDate
  //       const dateMessage: IMessage = {
  //         id: `${generateUUIDv4()}-time`,
  //         authorName: 'time',
  //         authorId: 'time',
  //         body: lastDate,
  //         status: 'none'
  //       }
  //       updatedMessagesWithDates.push(dateMessage)
  //     }
  //     updatedMessagesWithDates.push(message)
  //   })
  //   setMessages(updatedMessagesWithDates)
  // }

  return { setRef }
}
