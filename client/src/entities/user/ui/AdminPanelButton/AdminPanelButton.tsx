import { AppButton } from 'src/shared/ui'
import { useUser } from '../../model'

export const AdminPanelButton = () => {
  const { role } = useUser()
  if (role !== 'admin') return null
  return <AppButton prefixIconName="shield" borderless />
}
