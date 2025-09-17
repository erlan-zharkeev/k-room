import { useDispatch } from 'react-redux'

import { showModal } from 'src/entities/system'

export const useEditUserDataModalOpen = () => {
  const dispatch = useDispatch()

  const openModalEditUserData = () => {
    dispatch(
      showModal({
        title: 'Edit user data',
        modalContentComponentName: 'edit-user-data-modal'
      })
    )
  }

  return { openModalEditUserData }
}
