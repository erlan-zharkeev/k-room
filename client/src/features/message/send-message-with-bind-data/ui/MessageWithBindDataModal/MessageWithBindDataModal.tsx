import './style.scss'

import { useDispatch } from 'react-redux'

import { removeImageByNameFromMessageInputData, useSystem, useI18n } from 'src/entities/system'

import { AppImagePreview, AppModal } from 'src/shared/ui'

import { MESSAGE_WITH_BIND_DATA_MODAL_I18N, MessageInput } from '../../..'

export const MessageWithBindDataModal = ({
  open,
  onClose,
  roomId
}: {
  open: boolean
  onClose: () => void
  roomId: string
}) => {
  const { messageInputData } = useSystem()
  const { images } = messageInputData
  const dispatch = useDispatch()
  const { t } = useI18n()

  return (
    <AppModal title={t(MESSAGE_WITH_BIND_DATA_MODAL_I18N.title)} open={open} onClose={onClose}>
      <div className="message-with-bind-data-modal">
        <AppImagePreview images={images} removeImage={(name) => dispatch(removeImageByNameFromMessageInputData(name))} />
        <MessageInput roomId={roomId} emitTypingStatus={false} insideModal onSubmitSuccess={onClose} />
      </div>
    </AppModal>
  )
}
