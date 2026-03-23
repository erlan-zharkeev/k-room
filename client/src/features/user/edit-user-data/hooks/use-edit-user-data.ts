import { useState } from 'react'

import { MediaFileValueType, UserEndpointsEnum } from 'common-types'

import { useLoadMedia } from 'src/features/media'

import { useUser } from 'src/entities/user'

import { useApi } from 'src/shared/api'
import { AppFormData } from 'src/shared/ui'

export const useEditUserData = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { username, avatarPath, update, id: userId } = useUser()
  const { loadMedia } = useLoadMedia()

  const { doRequest } = useApi()

  const initialFormData = {
    username,
    avatar: avatarPath
  }

  const [isLoading, setIsLoading] = useState(false)

  const editUserData = async (fields: AppFormData) => {
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
    } catch (error) {
      console.error('Error updating user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { editUserData, isLoading, initialFormData }
}
