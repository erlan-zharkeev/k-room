import { Badge } from 'antd'

import { AppButton } from 'src/shared/ui'

import { useContact } from '../../hooks'

export const ContactsButton = () => {
  const { contactInvitationsQuantity } = useContact()

  return (
    <Badge color="var(--accent)" count={contactInvitationsQuantity} size="small" offset={[-8, 0]}>
      <AppButton prefixIconName="contacts" borderless />
    </Badge>
  )
}
