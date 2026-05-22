import { useDispatch } from 'react-redux'

import { unsetMinify } from 'src/shared/call-core'

import { AppDispatch, useTypedSelector } from 'src/shared/store'

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
