import { useState } from 'react'

import { UserEndpointsEnum } from 'common-types'
import { useDispatch } from 'react-redux'

import { closeModal } from 'src/entities/system'
import { useUser, setUserData } from 'src/entities/user'

import { useApi } from 'src/shared/api'
import { MediaFileValueType } from 'src/shared/config'
import { AppFormData } from 'src/shared/ui'

export const useUpdateUserData = () => {
  const { username, avatarPath } = useUser()

  const { doRequest } = useApi()

  const dispatch = useDispatch()

  const initialFormData = {
    username,
    avatarPath: avatarPath ? [{ name: 'avatar', src: avatarPath }] : []
  }

  const [isLoading, setIsLoading] = useState(false)

  const updateUserData = async (fields: AppFormData) => {
    const { username, avatar } = fields as { username: string; avatar: MediaFileValueType }

    const payloadFormData = new FormData()
    payloadFormData.append('username', username)
    payloadFormData.append('oldFilename', avatarPath?.split('?img=')[1] || '')

    const fileBuffer = avatar.fileBuffer
    if (fileBuffer) {
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' })
      payloadFormData.append('file', blob, avatar.name)
    }

    try {
      setIsLoading(true)
      const response = await doRequest('post', UserEndpointsEnum.UpdateUserData, payloadFormData, 'multipart/form-data')
      if (response?.data?.userData) {
        dispatch(setUserData(response.data.userData))
        dispatch(closeModal())
      }
    } catch (error) {
      console.error('Error updating user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateUserData, isLoading, initialFormData }
}
