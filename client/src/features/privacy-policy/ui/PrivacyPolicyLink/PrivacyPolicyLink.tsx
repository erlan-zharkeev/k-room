import { RouteNamesEnum } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { AppLink } from 'src/shared/ui'

export const PrivacyPolicyLink = () => {
  const navigate = useNavigate()

  return <AppLink text="Privacy policy" onClick={() => navigate(RouteNamesEnum.PrivacyPolicy)} />
}
