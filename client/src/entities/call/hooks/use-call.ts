import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { useTypedSelector } from 'src/shared/lib'

import { unsetMinify } from '../model'

export const useCall = () => {
  const { isMinified, currentCall, showCallModal } = useTypedSelector((state) => state.calls)
  const dispatch = useDispatch<AppDispatch>()

  const minifyCallWindow = () => dispatch(unsetMinify())
  return {
    isMinified,
    showCallModal,
    currentCall,
    minifyCallWindow
  }
}
