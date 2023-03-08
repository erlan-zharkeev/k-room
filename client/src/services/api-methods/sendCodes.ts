import { createAsyncThunk } from '@reduxjs/toolkit'
import { CodesEndPoints, CodeValidationPayload, Status } from 'common-types'
import { showNotification } from 'src/store/systemSlice'
import $api from '../$api'

export const sendEmailCodePasswordRecovery = createAsyncThunk(
  'SEND_EMAIL_CODE_PASSWORD_RECOVERY',
  async (form: FormData, { dispatch }) => {
    const response = await $api('post', CodesEndPoints.SEND_EMAIL_CODE_PASSWORD_RECOVERY, dispatch, form)
    const { message, status } = response.data
    const isBadRequest = status === Status.BAD_REQUEST
    dispatch(showNotification({ message, messageType: isBadRequest ? 'error' : 'info' }))
    return isBadRequest ? null : response.data
  }
)

export const validateEmailCodePasswordRecovery = createAsyncThunk(
  'VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY',
  async (form: CodeValidationPayload, { dispatch }) => {
    const response = await $api('post', CodesEndPoints.VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY, dispatch, form)
    const { message, status } = response.data
    const isBadRequest = status === Status.BAD_REQUEST
    if (isBadRequest) {
      dispatch(showNotification({ message, messageType: 'error' }))
    }
    return isBadRequest ? null : response.data
  }
)
