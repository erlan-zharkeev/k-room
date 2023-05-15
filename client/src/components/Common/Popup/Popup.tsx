import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { closeModal } from 'src/store/systemSlice'
import TechSettingsPopup from './Components/TechSettingsPopup/TechSettingsPopup'
import UserDataSettingsPopup from './Components/UserDataSettingsPopup/UserDataSettingsPopup'
import ForwardMessagePopup from './Components/ForwardMessagePopup/ForwardMessagePopup'

const Popup = () => {
  const { showModal, modalData } = useTypedSelector((state) => state.system)
  const dispatch = useDispatch<AppDispatch>()
  const popups: { [key: string]: JSX.Element } = {
    UserDataSettingsPopup: <UserDataSettingsPopup />,
    TechSettingsPopup: <TechSettingsPopup />,
    ForwardMessagePopup: <ForwardMessagePopup />
  }

  const Content = () => {
    return popups[modalData.modalContentComponentName] ? popups[modalData.modalContentComponentName] : null
  }

  return (
    <div className="modal">
      <Modal
        centered
        title={modalData.title}
        open={showModal}
        footer={null}
        onCancel={() => dispatch(closeModal())}
      >
        <Content />
      </Modal>
    </div>
  )
}

export default Popup
