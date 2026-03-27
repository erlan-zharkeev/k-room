import { useDispatch } from 'react-redux'

import { AppDispatchType } from 'src/app/store'

import { unsetMinify } from 'src/entities/call/model'

import { useTypedSelector } from 'src/shared/lib'

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
