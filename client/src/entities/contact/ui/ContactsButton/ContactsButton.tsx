import { Badge } from 'antd'
import { useContact } from '../../hooks'
import { Button } from 'src/shared/ui'

export const ContactsButton = () => {
  const { invitationsQuantity } = useContact()

  return (
    <Badge color="var(--accent)" count={invitationsQuantity} size="small" offset={[-15, 10]}>
      <Button type="radio" value="contacts" iconName="contacts" />
    </Badge>
  )
}
