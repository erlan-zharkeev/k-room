import { useState } from 'react'

import { MediaFileValueType, USER_ENDPOINTS } from 'common'

import { useLiveMediaUrl, useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'

import { useApi } from 'src/shared/api'
import { AppFormDataType } from 'src/shared/ui'

export const useEditUserData = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { username, shallowUpdate, id: userId } = useUser()
  const avatarPath = useLiveMediaUrl(`avatar.${userId}`)
  const { doRequest } = useApi()
  const { put, remove } = useMedia()

  const initialFormData = {
    username,
    avatar: avatarPath
  }

  const [isLoading, setIsLoading] = useState(false)

  const editUserData = async (fields: AppFormDataType) => {
    const { username, avatar } = fields as { username: string; avatar: MediaFileValueType }

    const payloadFormData = new FormData()
    payloadFormData.append('username', username)
    const resetAvatar = avatar === null
    payloadFormData.append('reset-avatar', resetAvatar ? 'reset' : '')

    const fileBuffer = avatar?.fileBuffer
    if (fileBuffer) {
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' })
      payloadFormData.append('file', blob, avatar.name)
    }

    try {
      setIsLoading(true)
      await doRequest('patch', USER_ENDPOINTS.editUserData, payloadFormData, {
        contentType: 'multipart/form-data'
      })
      shallowUpdate({ username })
      if (fileBuffer || resetAvatar) {
        const avatarId = `avatar.${userId}`

        if (resetAvatar) {
          remove(avatarId)
        } else if (fileBuffer) {
          const blob = new Blob([fileBuffer], { type: 'image/jpeg' })

          await put({
            id: avatarId,
            blob,
            contentType: blob.type,
            etag: `${Date.now()}`,
            kind: 'image',
            lastModified: new Date().toUTCString(),
            lastChecked: Date.now()
          })
        }
      }
      onSuccess?.()
    } catch {
      //
    } finally {
      setIsLoading(false)
    }
  }

  return { editUserData, isLoading, initialFormData }
}
