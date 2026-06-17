import { type ImageObject, MESSAGE_STATUS_VALUE, MINUTE_IN_MS } from 'global-shared'

import { buildImageAspectRatioDetails } from 'src/modules/media/lib/build-image-aspect-ratio-details'
import type { StreamMediaFileData } from 'src/modules/media/media.types'

import { BASE_FIXTURE_TIMESTAMP_MS, USER_BY_NICKNAME } from '../fixtures.constants'
import type { FixtureMessageData } from '../fixtures.types'

export const buildFixtureMessageId = (prefix: string, idx: number) => `${prefix}-${String(idx).padStart(3, '0')}`

export const buildFixtureMessageImageObject = (id: string, file: StreamMediaFileData): ImageObject => ({
  src: id,
  name: file.filename,
  ...buildImageAspectRatioDetails(file.metadata)
})

const resolveFixtureMessageImages = (
  imageIds: readonly string[],
  imageObjectById: ReadonlyMap<string, ImageObject>
): ImageObject[] => imageIds.map((id) => imageObjectById.get(id)!)

const buildFixtureMessageReactions = (reactions: FixtureMessageData['reactions'], roomNicknames: readonly string[]) => {
  const roomNicknameSet = new Set(roomNicknames)

  return reactions.flatMap(({ nickname, glyphKey }) => {
    if (!roomNicknameSet.has(nickname)) {
      return []
    }

    return [
      {
        nickname,
        authorId: USER_BY_NICKNAME[nickname]!.id,
        glyphKey
      }
    ]
  })
}

const buildFixtureRepliedMessage = (
  prefix: string,
  messageSources: readonly FixtureMessageData[],
  replyToIndex: number,
  imageObjectById: ReadonlyMap<string, ImageObject>
) => {
  const targetMessage = messageSources[replyToIndex - 1]!

  return {
    id: buildFixtureMessageId(prefix, replyToIndex),
    authorNickname: targetMessage.authorNickname,
    authorId: USER_BY_NICKNAME[targetMessage.authorNickname]!.id,
    body: targetMessage.body,
    images: resolveFixtureMessageImages(targetMessage.imageIds, imageObjectById)
  }
}

const buildFixtureMessage = (
  idx: number,
  prefix: string,
  roomUserIds: readonly string[],
  roomNicknames: readonly string[],
  messageSources: readonly FixtureMessageData[],
  messageSource: FixtureMessageData,
  createdAtOffsetMs: number,
  imageObjectById: ReadonlyMap<string, ImageObject>
) => {
  const { authorNickname, body, imageIds, reactions, replyToIndex } = messageSource
  const createdAt = BASE_FIXTURE_TIMESTAMP_MS + createdAtOffsetMs + idx * (11 * MINUTE_IN_MS)

  return {
    _id: buildFixtureMessageId(prefix, idx),
    authorId: USER_BY_NICKNAME[authorNickname]!.id,
    authorNickname,
    body,
    createdAt,
    reactions: buildFixtureMessageReactions(reactions, roomNicknames),
    images: resolveFixtureMessageImages(imageIds, imageObjectById),
    usersMetaData: roomUserIds.map((id) => ({ id, status: MESSAGE_STATUS_VALUE.DELIVERED })),
    repliedMessage: replyToIndex
      ? buildFixtureRepliedMessage(prefix, messageSources, replyToIndex, imageObjectById)
      : null
  }
}

export const buildFixtureMessages = (
  prefix: string,
  roomUserIds: readonly string[],
  roomNicknames: readonly string[],
  messageSources: readonly FixtureMessageData[],
  createdAtOffsetMs: number,
  imageObjectById: ReadonlyMap<string, ImageObject>
) => [
  ...messageSources.map((messageSource, index) =>
    buildFixtureMessage(
      index + 1,
      prefix,
      roomUserIds,
      roomNicknames,
      messageSources,
      messageSource,
      createdAtOffsetMs,
      imageObjectById
    )
  )
]
