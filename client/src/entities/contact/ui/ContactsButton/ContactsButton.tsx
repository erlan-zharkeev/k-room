import { Badge } from 'antd'

import { AppButton } from 'src/shared/ui'

import { useContact } from '../../hooks'

export const ContactsButton = () => {
  const { invitationsQuantity } = useContact()

  return (
    <Badge color="var(--accent)" count={invitationsQuantity} size="small" offset={[-15, 10]}>
      <AppButton prefixIconName="contacts" borderless />
    </Badge>
  )
}
