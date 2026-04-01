import { useState } from 'react'

import { MediaFileValueType, UserEndpointsEnum } from 'common'

import { useLoadMedia } from 'src/features/media'

import { useUser } from 'src/entities/user'

import { getHandledErrorMessage, useApi } from 'src/shared/api'
import { AppFormDataType } from 'src/shared/ui'
import { log } from 'src/shared/utils'

export const useEditUserData = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { username, avatarPath, update, id: userId } = useUser()
  const { loadMedia } = useLoadMedia()

  const { doRequest } = useApi()

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
      await doRequest('post', UserEndpointsEnum.EditUserData, payloadFormData, {
        contentType: 'multipart/form-data'
      })
      update({ username })
      if (fileBuffer || resetAvatar) {
        loadMedia(`avatar.${userId}`)
      }
      onSuccess?.()
    } catch (error: unknown) {
      log('error', getHandledErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return { editUserData, isLoading, initialFormData }
}
