import { useDispatch } from 'react-redux'

import { showModal } from 'src/entities/system'

export const useMessageForward = () => {
  const dispatch = useDispatch()

  const forwardMessageHandler = () => {
    // dispatch(repliedMessageSetAsForward())
    dispatch(showModal({ title: 'Forward message', modalContentComponentName: 'forward-message-modal' }))
  }

  return { forwardMessageHandler }
}
