import './style.scss'
import { ReactNode } from 'react'

import { Modal as AntdModal } from 'antd'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { ChatRoomSettingsPopup } from 'src/features/chat-room-settings'
import { CreateMultipleChatPopup } from 'src/features/create-multiple-chat'
import { DevicesPopup } from 'src/features/device'
import { ForwardMessagePopup } from 'src/features/forward-message'
import { MessageWithBindDataPopup } from 'src/features/send-message-with-bind-data'
import { UpdateUserDataModal } from 'src/features/update-user-data'

import { closeModal, useSystem } from 'src/entities/system'

import { AppButton } from 'src/shared/ui'

import { ModalContentComponentName } from './types'

export const Modal = () => {
  const { showModal, modalData } = useSystem()

  const dispatch = useDispatch<AppDispatch>()

  const popups: Record<ModalContentComponentName, ReactNode> = {
    'update-user-data-modal': <UpdateUserDataModal />,
    'devices-popup': <DevicesPopup />,
    'forward-message-popup': <ForwardMessagePopup />,
    'create-multiple-chat-popup': <CreateMultipleChatPopup />,
    'chat-room-settings-popup': <ChatRoomSettingsPopup />,
    'message-with-bind-data-popup': <MessageWithBindDataPopup />
  }
  const ComponentContent = modalData.modalContentComponentName ? (
    popups[modalData.modalContentComponentName]
  ) : (
    <p className="paragraph-text paragraph-text--md">{modalData.textContent ?? ''}</p>
  )

  return (
    <div className="modal">
      <AntdModal
        centered
        title={modalData.title}
        open={showModal}
        footer={null}
        onCancel={() => dispatch(closeModal())}
        destroyOnClose
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
