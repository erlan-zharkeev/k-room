import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit'

import axios from 'axios'

import { RootActions } from '../store'
import { AuthAction, setUserData } from '../store/authSlice'

import { createBrowserHistory } from 'history'
import { User, AuthEndPoints, Status, RouteNames } from 'k-room.types'
import { useNavigate } from 'react-router-dom'
import { showNotification } from '../store/systemSlice'

const customHistory = createBrowserHistory()

interface ApiServicePayload {
  credential?: User
  searchValue?: string
  searchType?: string
  email?: string
  userId?: string
}

export const apiService = async (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  action: RootActions,
  payload?: ApiServicePayload
) => {
  try {
    let response = null
    switch (action) {
      case AuthAction.REGISTRATION:
        response = await axios.post(AuthEndPoints.REGISTRATION, payload?.credential)
        if (response.status === Status.SUCCESS) {
          useNavigate()(
            `${RouteNames.WAIT_EMAIL_CONFIRM}?email=${response.data.email}&nextRequestTime=${response.data.timeNextRequest}`,
            { replace: true }
          )
        }
        break
      case AuthAction.EMAIL_CONFIRM:
        response = await axios.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION, { userId: payload?.userId })
        return response
      case AuthAction.SEND_EMAIL_CONFIRMATION_LINK:
        response = await axios.post(AuthEndPoints.SEND_EMAIL_CONFIRMATION_LINK, payload?.email)
        if (response.status === Status.SUCCESS) {
          customHistory.push(
            `${RouteNames.WAIT_EMAIL_CONFIRM}?email=${response.data.email}&nextRequestTime=${response.data.timeNextRequest}`
          )
        }
        break
      case AuthAction.LOGIN:
        response = await axios.post(AuthEndPoints.LOGIN, payload?.credential)
        console.log(response)
        if (response.status === Status.SUCCESS) dispatch(setUserData(response.data.userData))
        console.log(response.data.message)
        dispatch(showNotification({ message: response.data.message, messageType: 'success' }))
        customHistory.push(RouteNames.MAIN)
        break
      case AuthAction.UPDATE:
        response = await axios.post(AuthEndPoints.UPDATE_USER_DATA, payload?.credential)
        if (response.status === Status.SUCCESS) dispatch(setUserData(response.data.userData))
        dispatch(showNotification({ message: response.data.message, messageType: 'success' }))
        break
    }
  } catch (e: any) {
    const message = e.response.data.message[0] ?? 'An error has occurred, please try again later'
    dispatch(showNotification({ message, messageType: 'error' }))
  }
}
