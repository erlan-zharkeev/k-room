import { useUser } from 'src/entities/user'

import { AppText } from 'src/shared/ui'

export const TechSupportLink = () => {
  const { id } = useUser()

  return <AppText size="small">Support email is not configured yet. User ID: {id}</AppText>
}
