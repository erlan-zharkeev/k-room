import './style.scss'

import { useMemo, useState } from 'react'

import { CONTACT_MENU_I18N } from 'src/features/contact-menu'
import { IContactMenuProps } from 'src/features/contact-menu'
import { useCreateChatRoom } from 'src/features/create-chat-room'
import { DeleteContactConfirmModal, useDeleteContact } from 'src/features/delete-contact'
import { useChatRoomSelect } from 'src/features/select-chat-room'

import { useChatRoom } from 'src/entities/chat-room'

import { useTimeout, stopPropagation } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import { AppButton, AppDotsAnimatedText, AppDropdown, AppText } from 'src/shared/ui'

export const ContactMenu = ({ id, interactionType }: IContactMenuProps) => {
  const { deleteUserHandler, loading } = useDeleteContact()
  const { delay } = useTimeout()
  const { isLoading: isChatCreating, createChatRoom } = useCreateChatRoom()
  const { getPersonalByContactId, chatRooms } = useChatRoom()
  const { selectChatWithAsideById } = useChatRoomSelect()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { t } = useI18n()

  const contactRoom = useMemo(() => getPersonalByContactId(id), [chatRooms])

  const items = [
    {
      label: t(CONTACT_MENU_I18N.call),
      handler: () => {},
      value: 'call'
    },
    {
      label: t(CONTACT_MENU_I18N.createChat),
      loadingLabel: t(CONTACT_MENU_I18N.creatingChat),
      handler: (evt: unknown) => {
        stopPropagation(evt)
        createChatRoom({ formData: { contactIds: [id] } })
      },
      loading: isChatCreating,
      value: 'create-chat'
    },
    {
      label: t(CONTACT_MENU_I18N.text),
      handler: () => {
        selectChatWithAsideById(contactRoom?.id)
      },
      value: 'text'
    },
    {
      label: t(CONTACT_MENU_I18N.delete),
      handler: async (evt: unknown) => {
        stopPropagation(evt)
        await delay(400)
        setIsConfirmOpen(true)
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
    <>
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
      <DeleteContactConfirmModal
        open={isConfirmOpen}
        loading={loading}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          deleteUserHandler(id)
          setIsConfirmOpen(false)
        }}
      />
    </>
  )
}
