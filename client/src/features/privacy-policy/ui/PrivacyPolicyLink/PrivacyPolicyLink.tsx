import { RouteNamesEnum } from 'common-types'

import { AppLink } from 'src/shared/ui'

export const PrivacyPolicyLink = () => {
  return <AppLink to={RouteNamesEnum.PrivacyPolicy} text="Privacy policy" />
}
