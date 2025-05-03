import { useUser } from 'src/entities/user'

import { AppLink } from 'src/shared/ui'

const { VITE_MAIL_APP } = import.meta.env

export const TechSupportLink = () => {
  const { id } = useUser()

  return <AppLink href={`mailto:${VITE_MAIL_APP}?subject=Support%20Request(${id})`} text="Email to tech support" />
}
