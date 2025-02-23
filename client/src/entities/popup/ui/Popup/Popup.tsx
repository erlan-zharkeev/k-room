import './style.scss'
import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import {
  UserDataSettingsPopup,
  TechSettingsPopup,
  ForwardMessagePopup,
  CreateMultipleChatPopup,
  ChatRoomSettingsPopup,
  MessageWithBindDataPopup
} from './elements'
import { ReactNode } from 'react'
import { Button } from 'src/shared/ui'
import { closeModal } from 'src/entities/system'
import { useTypedSelector } from 'src/shared/lib'
import { ModalContentComponentName } from './types'

export const Popup = () => {
  const { showModal, modalData } = useTypedSelector((state) => state.system)
  const dispatch = useDispatch<AppDispatch>()
  const popups: Record<ModalContentComponentName, ReactNode> = {
    'user-data-settings-popup': <UserDataSettingsPopup />,
    'tech-settings-popup': <TechSettingsPopup />,
    'forward-message-popup': <ForwardMessagePopup />,
    'create-multiple-chat-popup': <CreateMultipleChatPopup />,
    'chat-room-settings-popup': <ChatRoomSettingsPopup />,
    'message-with-bind-data-popup': <MessageWithBindDataPopup />
  }

  const ComponentContent = modalData.modalContentComponentName ? (
    popups[modalData.modalContentComponentName]
  ) : (
    <p className="modal__confrirmation-content paragraph-text paragraph-text--secondary paragraph-text--md">
      {modalData.textContent ?? ''}
    </p>
  )

  return (
    <div className="modal">
      <Modal centered title={modalData.title} open={showModal} footer={null} onCancel={() => dispatch(closeModal())}>
        {ComponentContent}
        {modalData.textContent && (
          <div className="modal__confirmation-actions">
            <Button
              onClick={modalData.confirmBtn?.callback ?? (() => dispatch(closeModal()))}
              loading={modalData.confirmBtn?.loader}
              border="common-border"
              color="accent"
              text={modalData.confirmBtn?.text ?? 'OK'}
            />
            <Button
              onClick={modalData.cancelBtn?.callback ?? (() => dispatch(closeModal()))}
              loading={modalData.cancelBtn?.loader}
              text={modalData.cancelBtn?.text ?? 'Cancel'}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
