import { useUser } from 'src/entities/user'

import { CLIENT_ENV } from 'src/shared/config'
import { AppLink } from 'src/shared/ui'

export const TechSupportLink = () => {
  const { id } = useUser()

  return <AppLink href={`mailto:${CLIENT_ENV.mailApp}?subject=Support%20Request(${id})`} text="Email to tech support" />
}
