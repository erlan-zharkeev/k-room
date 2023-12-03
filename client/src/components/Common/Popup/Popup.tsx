import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/hooks'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/system-slice'
import { ChatRoomSettingsPopup } from './components/ChatRoomSettingsPopup/ChatRoomSettingsPopup'
import { CreateMultipleChatPopup } from './components/CreateMultipleChatPopup/CreateMultipleChatPopup'
import { ForwardMessagePopup } from './components/ForwardMessagePopup/ForwardMessagePopup'
import { MessageWithBindDataPopup } from './components/MessageWithBindDataPopup/MessageWithBindDataPopup'
import { TechSettingsPopup } from './components/TechSettingsPopup/TechSettingsPopup'
import { UserDataSettingsPopup } from './components/UserDataSettingsPopup/UserDataSettingsPopup'

export enum ModalContentComponentName {
  userDataSettingsPopup = 'UserDataSettingsPopup',
  techSettingsPopup = 'TechSettingsPopup',
  forwardMessagePopup = 'ForwardMessagePopup',
  createMultipleChatPopup = 'CreateMultipleChatPopup',
  chatRoomSettingsPopup = 'ChatRoomSettingsPopup',
  messageWithBindDataPopup = 'MessageWithBindDataPopup'
}

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
