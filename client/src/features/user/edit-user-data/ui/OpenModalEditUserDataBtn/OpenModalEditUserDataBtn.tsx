import { useState } from 'react'

import { AppLink, AppModal } from 'src/shared/ui'

import { EditUserDataModal } from '../EditUserDataModal/EditUserDataModal'

export const OpenModalEditUserDataBtn = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AppLink prevent text="Edit user data" onClick={() => setIsOpen(true)} />
      <AppModal title="Edit user data" open={isOpen} onClose={() => setIsOpen(false)}>
        <EditUserDataModal onSuccess={() => setIsOpen(false)} />
      </AppModal>
    </>
  )
}
