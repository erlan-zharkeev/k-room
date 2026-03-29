import { Badge } from 'antd'

import { AppButton } from 'src/shared/ui'

import { useContact } from '../..'

export const ContactsButton = () => {
  const { contactInvitationsQuantity } = useContact()

  return (
    <Badge color="var(--accent)" count={contactInvitationsQuantity} size="small" offset={['-8px', '5px']}>
      <AppButton prefixIconName="contacts" borderless />
    </Badge>
  )
}
