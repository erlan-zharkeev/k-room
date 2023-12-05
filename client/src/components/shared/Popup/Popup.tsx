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
  MessageWithBindDataPopup
} from './elements'
import { ModalContentComponentName } from 'src/@types'

export const Popup = () => {
  const { showModal, modalData } = useTypedSelector((state) => state.system)
  const dispatch = useDispatch<AppDispatch>()
  const popups: Record<ModalContentComponentName, JSX.Element> = {
    [ModalContentComponentName.userDataSettingsPopup]: <UserDataSettingsPopup />,
    [ModalContentComponentName.techSettingsPopup]: <TechSettingsPopup />,
    [ModalContentComponentName.forwardMessagePopup]: <ForwardMessagePopup />,
    [ModalContentComponentName.createMultipleChatPopup]: <CreateMultipleChatPopup />,
    [ModalContentComponentName.chatRoomSettingsPopup]: <ChatRoomSettingsPopup />,
    [ModalContentComponentName.messageWithBindDataPopup]: <MessageWithBindDataPopup />
  }
  const ComponentContent = () => popups[modalData.modalContentComponentName]

  return (
    <div className="modal">
      <Modal centered title={modalData.title} open={showModal} footer={null} onCancel={() => dispatch(closeModal())}>
        <ComponentContent />
      </Modal>
    </div>
  )
}
