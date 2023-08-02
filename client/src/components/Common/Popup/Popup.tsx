import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import TechSettingsPopup from './Components/TechSettingsPopup/TechSettingsPopup'
import UserDataSettingsPopup from './Components/UserDataSettingsPopup/UserDataSettingsPopup'
import ForwardMessagePopup from './Components/ForwardMessagePopup/ForwardMessagePopup'
import CreateMultipleChatPopup from './Components/CreateMultipleChatPopup/CreateMultipleChatPopup'
import ChatRoomSettingsPopup from './Components/ChatRoomSettingsPopup/ChatRoomSettingsPopup'
import MessageWithBindDataPopup from './Components/MessageWithBindDataPopup/MessageWithBindDataPopup'
import { ModalContentComponentName } from './@types'

const Popup = () => {
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

export default Popup
