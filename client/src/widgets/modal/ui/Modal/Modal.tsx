import './style.scss'
import { ReactNode, useMemo } from 'react'

import { Modal as AntdModal } from 'antd'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { ChatRoomSettingsModal, CreateChatRoomModal } from 'src/features/chat-room'
import { SelectDevicesModal } from 'src/features/device'
import { ForwardMessageModal, MessageWithBindDataModal, MessageWithBindDataModalMenu } from 'src/features/message'
import { UpdateUserDataModal } from 'src/features/user'

import { closeModal, useSystem, useViewport } from 'src/entities/system'

import { AppButton, AppHeader, AppText } from 'src/shared/ui'

import { ModalContentComponentName } from './types'

export const Modal = () => {
  const { showModal, modalData } = useSystem()
  const { lessOrEqualPhone } = useViewport()
  const dispatch = useDispatch<AppDispatch>()

  const popups: Record<ModalContentComponentName, ReactNode> = {
    'update-user-data-modal': <UpdateUserDataModal />,
    'select-devices-modal': <SelectDevicesModal />,
    'forward-message-modal': <ForwardMessageModal />,
    'create-chat-room-modal': <CreateChatRoomModal />,
    'chat-room-settings-modal': <ChatRoomSettingsModal />,
    'message-with-bind-data-modal': <MessageWithBindDataModal />
  }

  const additionalDropdownMenuElements: Partial<Record<ModalContentComponentName, ReactNode>> = {
    'message-with-bind-data-modal': <MessageWithBindDataModalMenu />
  }

  const ComponentContent = modalData.modalContentComponentName ? (
    popups[modalData.modalContentComponentName]
  ) : (
    <AppText>{modalData.textContent ?? ''}</AppText>
  )

  const modalWidth = useMemo(() => {
    if (lessOrEqualPhone) return 300
    return 420
  }, [lessOrEqualPhone])

  return (
    <AntdModal
      centered
      title={
        <div className="modal__title">
          <AppHeader tag="h4">{modalData.title}</AppHeader>
          {modalData.modalContentComponentName && additionalDropdownMenuElements[modalData.modalContentComponentName]}
        </div>
      }
      open={showModal}
      footer={null}
      onCancel={() => dispatch(closeModal())}
      destroyOnClose
      width={modalWidth}
      className="modal"
    >
      {ComponentContent}
      {modalData.textContent && (
        <div className="modal__confirmation-actions">
          <AppButton
            onClick={modalData.confirmBtn?.callback ?? (() => dispatch(closeModal()))}
            loading={modalData.confirmBtn?.loader}
            color="accent-color"
            text={modalData.confirmBtn?.text ?? 'OK'}
            fill
          />
          <AppButton
            onClick={modalData.cancelBtn?.callback ?? (() => dispatch(closeModal()))}
            loading={modalData.cancelBtn?.loader}
            text={modalData.cancelBtn?.text ?? 'Cancel'}
            fill
          />
        </div>
      )}
    </AntdModal>
  )
}
