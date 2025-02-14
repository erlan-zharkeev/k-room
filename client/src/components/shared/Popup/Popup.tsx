import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/hooks'
import { AppDispatch, closeModal } from 'src/store'
import {
  UserDataSettingsPopup,
  TechSettingsPopup,
  ForwardMessagePopup,
  CreateMultipleChatPopup,
  ChatRoomSettingsPopup,
  MessageWithBindDataPopup,
  DBClearConfirmPopup,
  ApplyBasicFixturesPopup
} from './elements'
import { ReactNode } from 'react'
import { ModalContentComponentName } from 'src/@enums'

export const Popup = () => {
  const { showModal, modalData } = useTypedSelector((state) => state.system)
  const dispatch = useDispatch<AppDispatch>()
  const popups: Record<ModalContentComponentName, ReactNode> = {
    [ModalContentComponentName.UserDataSettingsPopup]: <UserDataSettingsPopup />,
    [ModalContentComponentName.TechSettingsPopup]: <TechSettingsPopup />,
    [ModalContentComponentName.ForwardMessagePopup]: <ForwardMessagePopup />,
    [ModalContentComponentName.CreateMultipleChatPopup]: <CreateMultipleChatPopup />,
    [ModalContentComponentName.ChatRoomSettingsPopup]: <ChatRoomSettingsPopup />,
    [ModalContentComponentName.MessageWithBindDataPopup]: <MessageWithBindDataPopup />,
    [ModalContentComponentName.DBClearConfirmPopup]: <DBClearConfirmPopup />,
    [ModalContentComponentName.ApplyFixturesPopup]: <ApplyBasicFixturesPopup />
  }
  const ComponentContent = popups[modalData.modalContentComponentName]

  return (
    <div className="modal">
      <Modal centered title={modalData.title} open={showModal} footer={null} onCancel={() => dispatch(closeModal())}>
        {ComponentContent}
      </Modal>
    </div>
  )
}
