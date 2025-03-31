import './style.scss'
import { Modal as AntdModal } from 'antd'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { ReactNode } from 'react'
import { AppButton } from 'src/shared/ui'
import { closeModal } from 'src/entities/system'
import { useTypedSelector } from 'src/shared/lib'
import { ChatRoomSettingsPopup } from 'src/features/chat-room-settings'
import { TechSettingsPopup } from 'src/features/check-devices'
import { CreateMultipleChatPopup } from 'src/features/create-multiple-chat'
import { MessageWithBindDataPopup } from 'src/features/send-message-with-bind-data'
import { UserDataSettingsModal } from 'src/features/change-user-settings'
import { ForwardMessagePopup } from 'src/features/forward-message'
import { ModalContentComponentName } from './types'

export const Modal = () => {
  const { showModal, modalData } = useTypedSelector((state) => state.system)
  const dispatch = useDispatch<AppDispatch>()
  const popups: Record<ModalContentComponentName, ReactNode> = {
    'user-data-settings-modal': <UserDataSettingsModal />,
    'tech-settings-popup': <TechSettingsPopup />,
    'forward-message-popup': <ForwardMessagePopup />,
    'create-multiple-chat-popup': <CreateMultipleChatPopup />,
    'chat-room-settings-popup': <ChatRoomSettingsPopup />,
    'message-with-bind-data-popup': <MessageWithBindDataPopup />
  }
  const ComponentContent = modalData.modalContentComponentName ? (
    popups[modalData.modalContentComponentName]
  ) : (
    <p className="modal__confrirmation-content paragraph-text  paragraph-text--md">{modalData.textContent ?? ''}</p>
  )

  return (
    <div className="modal">
      <AntdModal
        centered
        title={modalData.title}
        open={showModal}
        footer={null}
        onCancel={() => dispatch(closeModal())}
      >
        {ComponentContent}
        {modalData.textContent && (
          <div className="modal__confirmation-actions">
            <AppButton
              onClick={modalData.confirmBtn?.callback ?? (() => dispatch(closeModal()))}
              loading={modalData.confirmBtn?.loader}
              color="accent-color"
              text={modalData.confirmBtn?.text ?? 'OK'}
            />
            <AppButton
              onClick={modalData.cancelBtn?.callback ?? (() => dispatch(closeModal()))}
              loading={modalData.cancelBtn?.loader}
              text={modalData.cancelBtn?.text ?? 'Cancel'}
            />
          </div>
        )}
      </AntdModal>
    </div>
  )
}
