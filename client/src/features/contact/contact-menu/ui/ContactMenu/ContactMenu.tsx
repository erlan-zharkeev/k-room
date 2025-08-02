import './style.scss'

import { useMemo } from 'react'

import { useChatRoomSelect, useCreateChatRoom } from 'src/features/chat-room'
import { useDeleteContact } from 'src/features/contact'

import { useChatRooms } from 'src/entities/chat-room'

import { useTimeout } from 'src/shared/lib'
import { AppButton, AppDotsAnimatedText, AppDropdown, AppText } from 'src/shared/ui'
import { stopPropagation } from 'src/shared/utils'

export const ContactMenu = ({ id }: { id: string }) => {
  const { deleteUserHandler } = useDeleteContact()
  const { delay } = useTimeout()
  const { isLoading: isChatCreating, createChatRoom } = useCreateChatRoom()
  const { getPersonalRoomByContactId, chatRooms } = useChatRooms()
  const { selectChatWithAsideById } = useChatRoomSelect()

  const contactRoom = useMemo(() => getPersonalRoomByContactId(id), [chatRooms])

  const items = [
    {
      label: 'Call',
      handler: () => {}
    },
    {
      label: 'Create chat',
      loadingLabel: 'Creating chat',
      handler: (evt: unknown) => {
        stopPropagation(evt)
        createChatRoom({ formData: { contactIds: [id] } })
      },
      loading: isChatCreating
    },
    {
      label: 'Text',
      handler: () => {
        selectChatWithAsideById(contactRoom?.id)
      }
    },
    {
      label: 'Delete',
      handler: async () => {
        await delay(2000)
        deleteUserHandler(id)
      }
    }
  ]

  const filteredItems = items.filter((item) => {
    if (item.label === 'Create chat') {
      return !contactRoom
    }
    return true
  })

  return (
    <AppDropdown
      additionalClassName="contact-menu"
      items={filteredItems.map((item, idx) => ({
        type: 'item',
        onClick: item.handler,
        label: item.loading ? <AppDotsAnimatedText text={item.loadingLabel} /> : <AppText>{item.label}</AppText>,
        key: idx
      }))}
    >
      <AppButton prefixIconName="three-dots" borderless small />
    </AppDropdown>
  )
}
