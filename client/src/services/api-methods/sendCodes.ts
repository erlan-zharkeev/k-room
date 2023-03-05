import { createAsyncThunk } from '@reduxjs/toolkit'
import { CodesEndPoints } from 'common-types'
import $api from '../$api'

export const sendEmailCodePasswordRecovery = createAsyncThunk(
  'SEND_EMAIL_CODE_PASSWORD_RECOVERY',
  async (form: FormData, { dispatch }) => {
    return await $api('post', CodesEndPoints.SEND_EMAIL_CODE_PASSWORD_RECOVERY, dispatch, form)
  }
)
