import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import UserDataSettingsPopup from './Components/UserDataSettingsPopup/UserDataSettingsPopup'

const Popup = () => {
  const { showModal, modalData } = useTypedSelector((state) => state.system)
  const dispatch = useDispatch<AppDispatch>()
  const popups: { [key: string]: JSX.Element } = {
    UserDataSettingsPopup: <UserDataSettingsPopup />
  }

  const Content = () => {
    return popups[modalData.modalContentComponentName] ? popups[modalData.modalContentComponentName] : null
  }

  return (
    <div className="modal">
      <Modal
        centered
        title={modalData.title}
        visible={showModal}
        footer={null}
        onCancel={() => dispatch(closeModal())}
        style={{ maxWidth: '320px' }}
      >
        <Content />
      </Modal>
    </div>
  )
}

export default Popup
