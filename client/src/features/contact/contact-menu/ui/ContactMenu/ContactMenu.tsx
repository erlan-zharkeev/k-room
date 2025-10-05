import './style.scss'

import { useMemo } from 'react'

import { InteractionType } from 'common-types'

import { useChatRoomSelect, useCreateChatRoom } from 'src/features/chat-room'
import { useDeleteContact } from 'src/features/contact'

import { useChatRoom } from 'src/entities/chat-room'

import { useTimeout } from 'src/shared/lib'
import { AppButton, AppDotsAnimatedText, AppDropdown, AppText } from 'src/shared/ui'
import { stopPropagation } from 'src/shared/utils'

export const ContactMenu = ({ id, interactionType }: { id: string; interactionType: InteractionType }) => {
  const { deleteUserHandler } = useDeleteContact()
  const { delay } = useTimeout()
  const { isLoading: isChatCreating, createChatRoom } = useCreateChatRoom()
  const { getPersonalRoomByContactId, chatRooms } = useChatRoom()
  const { selectChatWithAsideById } = useChatRoomSelect()

  const contactRoom = useMemo(() => getPersonalRoomByContactId(id), [chatRooms])

  const items = [
    {
      label: 'Call',
      handler: () => {},
      value: 'call'
    },
    {
      label: 'Create chat',
      loadingLabel: 'Creating chat',
      handler: (evt: unknown) => {
        stopPropagation(evt)
        createChatRoom({ formData: { contactIds: [id] } })
      },
      loading: isChatCreating,
      value: 'create-chat'
    },
    {
      label: 'Text',
      handler: () => {
        selectChatWithAsideById(contactRoom?.id)
      },
      value: 'text'
    },
    {
      label: 'Delete',
      handler: async () => {
        await delay(400)
        deleteUserHandler(id)
      },
      value: 'delete'
    }
  ]

  const filteredItems = items.filter((item) => {
    if (interactionType === 'default') {
      return item.value === 'delete'
    }
    if (item.value === 'create-chat') {
      return !contactRoom
    }
    if (item.value === 'text') {
      return contactRoom
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
