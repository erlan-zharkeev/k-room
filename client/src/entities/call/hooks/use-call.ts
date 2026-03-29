import { useDispatch } from 'react-redux'

import { AppDispatchType } from 'src/app/store'

import { useTypedSelector } from 'src/shared/lib'

import { unsetMinify } from '..'

export const useCall = () => {
  const { isMinified, currentCall, showCallModal } = useTypedSelector((state) => state.calls)
  const dispatch = useDispatch<AppDispatchType>()

  const minifyCallWindow = () => dispatch(unsetMinify())
  return {
    isMinified,
    showCallModal,
    currentCall,
    minifyCallWindow
  }
}
