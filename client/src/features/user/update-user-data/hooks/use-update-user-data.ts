import { useState } from 'react'

import { UserEndpointsEnum } from 'common-types'
import { useDispatch } from 'react-redux'

import { closeModal } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { useApi } from 'src/shared/api'
import { AppFormData } from 'src/shared/ui'

export const useUpdateUserData = () => {
  const { username } = useUser()

  const { doRequest } = useApi()

  const dispatch = useDispatch()

  const initialFormData = {
    username,
    avatar: avatar ? [{ name: 'avatar', src: avatar }] : []
  }

  const [isLoading, setIsLoading] = useState(false)

  const updateUserData = async (fields: AppFormData) => {
    const { username, avatar } = fields as { username: string; avatar: MediaFileValueType }

    const payloadFormData = new FormData()
    payloadFormData.append('username', username)
    payloadFormData.append('oldFilename', avatar?.split('?img=')[1] || '')

    const fileBuffer = avatar.fileBuffer
    if (fileBuffer) {
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' })
      payloadFormData.append('file', blob, avatar.name)
    }

    try {
      setIsLoading(true)
      const response = await doRequest('post', UserEndpointsEnum.UpdateUserData, payloadFormData, {
        contentType: 'multipart/form-data'
      })
      dispatch(setUserData(response.data))
      dispatch(closeModal())
    } catch (error) {
      console.error('Error updating user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateUserData, isLoading, initialFormData }
}
