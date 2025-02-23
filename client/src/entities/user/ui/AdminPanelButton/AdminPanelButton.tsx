import { Button } from 'src/shared/ui'
import { useUser } from '../../model'

export const AdminPanelButton = () => {
  const { role } = useUser()
  if (role !== 'admin') return null
  return <Button type="radio" value="admin-panel" iconName="shield" />
}
