import './style.scss'

import { useMemo, useState } from 'react'

import { Badge } from 'antd'

import { SocketActionsType } from 'common'

import { ChatRoomPreview, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useLiveMediaUrl } from 'src/entities/media-file'

import { socket } from 'src/shared/api'
import { FChatRoomType } from 'src/shared/config'
import { chatRoomUnreadMessagesCount, createClassNameWithModifiers, useAnimatedList } from 'src/shared/lib'
import { useI18n, useSettings } from 'src/shared/preferences'
import { AppAvatar, AppButton, AppForm, AppHeader, AppModal, AppScrollContainer, AppText } from 'src/shared/ui'

import { useChatRoomSelect } from '../../../../model/use-chat-room-select'
import { useMessage } from '../../../../model/use-message'

import {
  CHAT_ROOM_LIST_I18N,
  CHAT_ROOMS_WIDGET_I18N,
  CREATE_CHAT_ROOM_BTN_I18N,
  CREATE_CHAT_ROOM_FORM_I18N
} from './i18n.ts'

const ContactAvatar = ({ id }: { id: string }) => {
  const url = useLiveMediaUrl(`avatar.${id}`)

  return <AppAvatar src={url} showBadge={false} />
}

const usePickContact = () => {
  const { contacts } = useContact()
  const [pickedContactIds, setPickedContactIds] = useState<string[]>([])
  const [filterQuery, setFilterQuery] = useState('')
  const { getPersonalByContactId } = useChatRoom()

  const contactListToPick = useMemo(() => {
    const query = filterQuery.trim().toLowerCase()

    return contacts
      .filter((contact) => contact.interactionType === 'invite-accepted')
      .filter((contact) => !query || contact.username.toLowerCase().includes(query))
      .map((contact) => ({
        label: contact.username,
        value: contact.id,
        prefixSlot: <ContactAvatar id={contact.id} />
      }))
  }, [contacts, filterQuery])

  const isPrivateChatAlreadyExists = useMemo(() => {
    if (pickedContactIds.length !== 1) return false
    return Boolean(getPersonalByContactId(pickedContactIds[0]))
  }, [getPersonalByContactId, pickedContactIds])

  return {
    filterQuery,
    setFilterQuery,
    contactListToPick,
    pickedContactIds,
    setPickedContactIds,
    isPrivateChatAlreadyExists
  }
}

const useCreateChatRoom = ({
  onSuccess,
  onRoomCreated
}: {
  onSuccess?: () => void
  onRoomCreated?: (roomId: string) => void
} = {}) => {
  const [isLoading, setIsLoading] = useState(false)

  const createChatRoom = (formData: { avatarFile?: unknown; chatName?: string; contactIds: string[] }) => {
    setIsLoading(true)
    const { avatarFile, chatName, contactIds } = formData

    socket.emit<SocketActionsType>('create-chat-room', { avatarFile, chatName, contactIds })
    socket.once<SocketActionsType>('room-created', ({ roomId }: { roomId: string }) => {
      onRoomCreated?.(roomId)
      setIsLoading(false)
      onSuccess?.()
    })
  }

  return {
    isLoading,
    createChatRoom
  }
}

const CreateChatRoomForm = ({
  onSuccess,
  onRoomCreated
}: {
  onSuccess?: () => void
  onRoomCreated?: (roomId: string) => void
}) => {
  const { isLoading, createChatRoom } = useCreateChatRoom({ onSuccess, onRoomCreated })
  const { t } = useI18n()
  const {
    contactListToPick,
    pickedContactIds,
    setPickedContactIds,
    filterQuery,
    setFilterQuery,
    isPrivateChatAlreadyExists
  } = usePickContact()
  const fromTitle = t(CREATE_CHAT_ROOM_FORM_I18N.fromTitle) as (count: number) => string

  return (
    <AppForm
      onSubmit={(formData) =>
        createChatRoom(formData as { avatarFile?: unknown; chatName?: string; contactIds: string[] })
      }
      onChange={(formData) => {
        setFilterQuery((formData.query as string) ?? '')
        setPickedContactIds((formData.contactIds as string[]) ?? [])
      }}
      fields={{
        query: {
          value: filterQuery,
          inputType: 'text',
          placeholder: t(CREATE_CHAT_ROOM_FORM_I18N.queryPlaceholder),
          label: t(CREATE_CHAT_ROOM_FORM_I18N.queryLabel),
          hide: !(contactListToPick.length > 3)
        },
        contactIds: {
          inputType: 'element-picker',
          availableElements: contactListToPick,
          fromTitle: fromTitle(pickedContactIds.length),
          toTitle: t(CREATE_CHAT_ROOM_FORM_I18N.toTitle),
          rule: { name: 'required' }
        },
        avatarFile: {
          inputType: 'file',
          design: 'avatar',
          avatarStubIcon: 'image-stub',
          avatarShape: 'square-shape',
          avatarBorderless: true,
          hide: !(pickedContactIds.length > 1),
          label: t(CREATE_CHAT_ROOM_FORM_I18N.avatarLabel)
        },
        chatName: {
          inputType: 'text',
          placeholder: t(CREATE_CHAT_ROOM_FORM_I18N.chatNamePlaceholder),
          rule: { name: 'required' },
          hide: !(pickedContactIds.length > 1),
          label: t(CREATE_CHAT_ROOM_FORM_I18N.chatNameLabel)
        }
      }}
      disabledActionBtn={isPrivateChatAlreadyExists}
      submitBtnText={t(CREATE_CHAT_ROOM_FORM_I18N.submit)}
      actionProcessing={isLoading}
    >
      {isPrivateChatAlreadyExists && (
        <div className="create-chat-room-form__warning">
          <AppText size="small" color="warn-color">
            {t(CREATE_CHAT_ROOM_FORM_I18N.privateChatExists)}
          </AppText>
        </div>
      )}
    </AppForm>
  )
}

const CreateChatRoomButton = ({ onRoomCreated }: { onRoomCreated?: (roomId: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <AppButton text={t(CREATE_CHAT_ROOM_BTN_I18N.button)} fill onClick={() => setIsOpen(true)} />
      <AppModal title={t(CREATE_CHAT_ROOM_BTN_I18N.modalTitle)} open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="create-chat-room-modal">
          <CreateChatRoomForm onSuccess={() => setIsOpen(false)} onRoomCreated={onRoomCreated} />
        </div>
      </AppModal>
    </>
  )
}

const ChatRoomListItemPreview = ({ room, isRoomSelected }: { room: FChatRoomType; isRoomSelected: boolean }) => {
  const { contacts } = useContact()
  const { getById } = useMessage()
  const avatar = useLiveMediaUrl(room.avatarId)
  const privateRoom = isRoomPrivate(room)
  const privateContact = contacts.find((contact) => contact.id === room.users[0])
  const title = room.chatName || privateContact?.username || ''
  const lastMessageBody = room.lastMessageId ? getById(room.lastMessageId)?.body ?? '' : ''

  return (
    <ChatRoomPreview
      avatar={avatar}
      title={title}
      description={lastMessageBody}
      online={privateContact?.online}
      isPrivate={privateRoom}
      isRoomSelected={isRoomSelected}
    />
  )
}

const ChatRoomList = () => {
  const { chatRooms, hasChatRooms } = useChatRoom()
  const { messages } = useMessage()
  const { selectedChatRoomId } = useSettings()
  const { t } = useI18n()
  const { renderedItems } = useAnimatedList(chatRooms ?? [], 'id')
  const { selectChatRoomById } = useChatRoomSelect()

  return (
    <div className="chat-room-list">
      {!hasChatRooms && <AppText>{t(CHAT_ROOM_LIST_I18N.empty)}</AppText>}
      <AppScrollContainer height="100%" additionalClassName="chat-room-list__scroll-container">
        {renderedItems.map(({ item: chatRoom, key, state }) => (
          <button
            type="button"
            className={createClassNameWithModifiers({
              rootClass: 'chat-room-list__list-item animated-list__item',
              modifiers: [chatRoom.id === selectedChatRoomId && 'selected', state],
              additionalClassName: `animated-list__item--${state}`
            })}
            onClick={(event) => {
              event.stopPropagation()
              selectChatRoomById(chatRoom.id)
            }}
            key={key}
          >
            <ChatRoomListItemPreview room={chatRoom} isRoomSelected={chatRoom.id === selectedChatRoomId} />
            {Boolean(chatRoomUnreadMessagesCount(chatRoom, messages)) && (
              <Badge color="var(--accent)" count={chatRoomUnreadMessagesCount(chatRoom, messages)} offset={[-5, 0]} />
            )}
          </button>
        ))}
      </AppScrollContainer>
    </div>
  )
}

export const ChatRooms = () => {
  const { t } = useI18n()
  const { selectChatWithAsideById } = useChatRoomSelect()

  return (
    <div className="chat-rooms">
      <CreateChatRoomButton onRoomCreated={selectChatWithAsideById} />
      <div className="divider" />
      <AppHeader tag="h4">{t(CHAT_ROOMS_WIDGET_I18N.title)}</AppHeader>
      <ChatRoomList />
    </div>
  )
}
