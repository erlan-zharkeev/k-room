import { Badge } from 'antd'
import { useContact } from '../../hooks'
import { AppButton } from 'src/shared/ui'

export const ContactsButton = () => {
  const { invitationsQuantity } = useContact()

  return (
    <Badge color="var(--accent)" count={invitationsQuantity} size="small" offset={[-15, 10]}>
      <AppButton prefixIconName="contacts" borderless />
    </Badge>
  )
}
