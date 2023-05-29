import { createAsyncThunk } from '@reduxjs/toolkit'
import { CodesEndPoints, CodeValidationPayload } from 'common-types'
import $api from 'src/services/$api'

export const sendEmailCodePasswordRecovery = createAsyncThunk(
  'SEND_EMAIL_CODE_PASSWORD_RECOVERY',
  async (form: FormData, { dispatch }) =>
    await $api('post', CodesEndPoints.SEND_EMAIL_CODE_PASSWORD_RECOVERY, dispatch, form)
)

export const validateEmailCodePasswordRecovery = createAsyncThunk(
  'VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY',
  async (form: CodeValidationPayload, { dispatch }) =>
    await $api('post', CodesEndPoints.VALIDATE_EMAIL_CODE_PASSWORD_RECOVERY, dispatch, form)
)
