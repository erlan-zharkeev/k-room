import { Badge } from 'antd'

import { useContact } from 'src/entities/contact'

import { AppButton } from 'src/shared/ui'

export const ContactsButton = () => {
  const { contactInvitationsQuantity } = useContact()

  return (
    <Badge color="var(--accent)" count={contactInvitationsQuantity} size="small" offset={['-8px', '5px']}>
      <AppButton prefixIconName="contacts" borderless />
    </Badge>
  )
}
