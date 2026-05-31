import {
  type EventMessageEdited,
  type EventMessageDeleted,
  type EventMessageDelivered,
  type EventMessageLinkPreviewUpdated,
  type EventMessagesStatusUpdated,
  type EventPinnedMessageUpdated,
  type EventUpdateMessageStatus,
  type EventUpdatedMessageReactions,
  type MediaObject,
  type Message,
  MESSAGE_REACTION_UPDATE_ACTION,
  isMessageReadStatus,
  isMessageStatusDelivered
} from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import {
  MESSAGE_AUDIO_DRAFT_MEDIA_ID_PREFIX,
  MESSAGE_DOCUMENT_DRAFT_MEDIA_ID_PREFIX,
  MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX,
  MESSAGE_VIDEO_DRAFT_MEDIA_ID_PREFIX,
  useMedia
} from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'

import { useMessageNotification } from './use-message-notification.model'

export const useMessageSync = () => {
  const { mutate: mutateRoom } = useChatRoom()
  const { bulkDelete: bulkDeleteMedia, get: getMedia, put: putMedia } = useMedia()
  const { bulkUpdate, getById, messageById, mutate: mutateMessage, put, remove, update } = useMessage()
  const { user } = useUser()
  const { playDeliveredMessageSound, showDeliveredMessageToast } = useMessageNotification()

  const decreaseUnreadMessagesQuantity = async (roomId: string, quantity = 1) => {
    await mutateRoom(roomId, (room) => {
      room.unreadMessagesQuantity = Math.max(0, (room.unreadMessagesQuantity ?? 0) - quantity)
    })
  }

  const isMessageDraftMediaId = (mediaId: string) => {
    const isImageDraftMediaId = mediaId.startsWith(MESSAGE_IMAGE_DRAFT_MEDIA_ID_PREFIX)
    const isDocumentDraftMediaId = mediaId.startsWith(MESSAGE_DOCUMENT_DRAFT_MEDIA_ID_PREFIX)
    const isAudioDraftMediaId = mediaId.startsWith(MESSAGE_AUDIO_DRAFT_MEDIA_ID_PREFIX)
    const isVideoDraftMediaId = mediaId.startsWith(MESSAGE_VIDEO_DRAFT_MEDIA_ID_PREFIX)
    const isVisualDraftMediaId = isImageDraftMediaId || isDocumentDraftMediaId

    return [isVisualDraftMediaId, isAudioDraftMediaId, isVideoDraftMediaId].some(Boolean)
  }

  const resolveMessageDraftMediaIds = ({ audios = [], documents = [], images = [], videos = [] }: Message) => {
    const mediaIds = [...images, ...documents, ...audios, ...videos].map(({ src }) => src)

    return mediaIds.filter(isMessageDraftMediaId)
  }

  const copyDraftMediaBlobToDeliveredMedia = async (
    draftMedia: MediaObject | undefined,
    deliveredMedia: MediaObject
  ) => {
    if (!draftMedia) return
    if (!isMessageDraftMediaId(draftMedia.src)) return

    const draftRecord = await getMedia(draftMedia.src)

    if (!draftRecord?.blob) return

    await putMedia({
      ...draftRecord,
      id: deliveredMedia.src,
      etag: undefined,
      lastChecked: 0,
      lastModified: undefined,
      status: 'ready'
    })
  }

  const preserveDeliveredMessageMediaBlobs = async (currentMessage: Message | undefined, deliveredMessage: Message) => {
    if (!currentMessage) return

    const mediaPairs: Array<[MediaObject[], MediaObject[]]> = [
      [currentMessage.images ?? [], deliveredMessage.images ?? []],
      [currentMessage.documents ?? [], deliveredMessage.documents ?? []],
      [currentMessage.audios ?? [], deliveredMessage.audios ?? []],
      [currentMessage.videos ?? [], deliveredMessage.videos ?? []]
    ]

    await Promise.all(
      mediaPairs.flatMap(([draftMediaObjects, deliveredMediaObjects]) =>
        deliveredMediaObjects.map((deliveredMedia, index) =>
          copyDraftMediaBlobToDeliveredMedia(draftMediaObjects[index], deliveredMedia)
        )
      )
    )
  }

  const handleDeliveredMessage = async ({ roomId, message }: EventMessageDelivered) => {
    const currentMessage = getById(message.id)
    const draftMediaIds = currentMessage ? resolveMessageDraftMediaIds(currentMessage) : []

    await preserveDeliveredMessageMediaBlobs(currentMessage, message)
    await put(message)

    if (draftMediaIds.length) {
      await bulkDeleteMedia(draftMediaIds)
    }

    await mutateRoom(roomId, (room) => {
      const { messages } = room

      if (messages[messages.length - 1] !== message.id) {
        messages.push(message.id)
      }

      if (!message.isSelf && isMessageStatusDelivered(message.status)) {
        room.unreadMessagesQuantity = (room.unreadMessagesQuantity ?? 0) + 1
      }
    })
    showDeliveredMessageToast({ roomId, message })
    void playDeliveredMessageSound({ roomId, message })
  }

  const handleMessageEdited = async ({
    audios,
    body,
    documents,
    editedAt,
    images,
    linkPreview,
    messageId,
    videos
  }: EventMessageEdited) => {
    await update(messageId, {
      body,
      editedAt,
      images,
      linkPreview,
      ...(documents && { documents }),
      ...(audios && { audios }),
      ...(videos && { videos })
    })
  }

  const handleMessageLinkPreviewUpdated = async ({ linkPreview, messageId }: EventMessageLinkPreviewUpdated) => {
    await update(messageId, { linkPreview })
  }

  const updateMessageStatus = async ({ roomId, messageId, status, userId }: EventUpdateMessageStatus) => {
    const shouldDecreaseUnreadMessagesQuantity = userId === user.value.id && isMessageReadStatus(status)

    await update(messageId, { status })

    if (shouldDecreaseUnreadMessagesQuantity) {
      await decreaseUnreadMessagesQuantity(roomId)
    }
  }

  const updateMessagesStatus = async ({
    roomId,
    messageIds,
    status,
    userId,
    updatedMessagesQuantity
  }: EventMessagesStatusUpdated) => {
    const loadedMessageIds = messageIds.filter((messageId) => messageById.value.has(messageId))
    const isCurrentUserStatusUpdate = userId === user.value.id
    const isReadStatusUpdate = isMessageReadStatus(status)

    await bulkUpdate(loadedMessageIds.map((id) => ({ id, changes: { status } })))

    if (isCurrentUserStatusUpdate && isReadStatusUpdate) {
      await decreaseUnreadMessagesQuantity(roomId, updatedMessagesQuantity)
    }
  }

  const handleMessageDeleted = async ({ messageId, roomId }: EventMessageDeleted) => {
    const message = getById(messageId)

    await remove(messageId)
    await mutateRoom(roomId, (room) => {
      const messages = room.messages.filter((id) => id !== messageId)

      room.messages = messages

      if (room.lastMessageId === messageId) {
        room.lastMessageId = messages[messages.length - 1] ?? null
      }

      if (room.pinnedMessageId === messageId) {
        room.pinnedMessageId = null
      }
    })

    const hasDeletedMessage = Boolean(message)
    const isDeletedDeliveredMessage = message ? isMessageStatusDelivered(message.status) : false
    const isDeletedMessageFromContact = message ? !message.isSelf : false
    const shouldDecreaseUnreadMessagesQuantity =
      hasDeletedMessage && isDeletedDeliveredMessage && isDeletedMessageFromContact

    if (shouldDecreaseUnreadMessagesQuantity) {
      await decreaseUnreadMessagesQuantity(roomId)
    }
  }

  const handleMessageReactionUpdate = async ({ messageId, action, reaction }: EventUpdatedMessageReactions) => {
    await mutateMessage(messageId, (message) => {
      const reactions = message.reactions ?? []

      switch (action) {
        case MESSAGE_REACTION_UPDATE_ACTION.ADD: {
          const hasReaction = reactions.some(
            ({ authorId, glyphKey }) => authorId === reaction.authorId && glyphKey === reaction.glyphKey
          )

          if (hasReaction) return

          message.reactions = [...reactions, reaction]
          break
        }
        case MESSAGE_REACTION_UPDATE_ACTION.REMOVE:
          message.reactions = reactions.filter(
            ({ authorId, glyphKey }) => authorId !== reaction.authorId || glyphKey !== reaction.glyphKey
          )
          break
      }
    })
  }

  const handlePinnedMessageUpdated = async ({ pinnedMessage, pinnedMessageId, roomId }: EventPinnedMessageUpdated) => {
    if (pinnedMessage) {
      await put(pinnedMessage)
    }

    await mutateRoom(roomId, (room) => {
      room.pinnedMessageId = pinnedMessageId
    })
  }

  return {
    handleDeliveredMessage,
    handleMessageEdited,
    handleMessageLinkPreviewUpdated,
    handleMessageDeleted,
    handleMessageReactionUpdate,
    handlePinnedMessageUpdated,
    updateMessageStatus,
    updateMessagesStatus
  }
}
