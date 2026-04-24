import { Badge } from 'antd'

import { useContact } from 'src/entities/contact/model/use-contact'

import { AppButton } from 'src/shared/ui'

export const ContactsButton = () => {
  const { invitationsQuantity } = useContact()

  return (
    <Badge color="var(--accent)" count={invitationsQuantity} size="small" offset={['-8px', '5px']}>
      <AppButton prefixIconName="contacts" borderless />
    </Badge>
  )
}
