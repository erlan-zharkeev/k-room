import { AppLink } from 'src/shared/ui'

import { useEditUserDataModalOpen } from '../../hooks/use-edit-user-data-modal-open'

export const OpenModalEditUserDataBtn = () => {
  const { openModalEditUserData } = useEditUserDataModalOpen()

  return <AppLink prevent text="Edit user data" onClick={openModalEditUserData} />
}
