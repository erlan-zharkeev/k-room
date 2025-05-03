import { AppLink } from 'src/shared/ui'

import { useUpdateUserDataModalOpen } from '../../hooks/use-update-user-data-modal-open'

export const OpenModalUpdateUserDataBtn = () => {
  const { openModalUpdateUserData } = useUpdateUserDataModalOpen()

  return <AppLink text="Change user data" onClick={openModalUpdateUserData} />
}
