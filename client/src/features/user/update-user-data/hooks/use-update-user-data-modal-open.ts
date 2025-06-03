import { useDispatch } from 'react-redux'

import { showModal } from 'src/entities/system'

export const useUpdateUserDataModalOpen = () => {
  const dispatch = useDispatch()

  const openModalUpdateUserData = () => {
    dispatch(
      showModal({
        title: 'Update User Data',
        modalContentComponentName: 'update-user-data-modal'
      })
    )
  }

  return { openModalUpdateUserData }
}
