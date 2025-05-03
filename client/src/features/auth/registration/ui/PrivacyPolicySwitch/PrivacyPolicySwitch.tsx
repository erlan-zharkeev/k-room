import './style.scss'

import { RouteNamesEnum } from 'common-types'

import { AppLink, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const PrivacyPolicySwitch = ({ disabled }: { disabled: boolean }) => {
  const className = createClassNameWithModifiers({
    rootClass: 'privacy-policy-switch',
    modifiers: [disabled && 'disabled']
  })

  return (
    <AppText additionalClassName={className} size="sm">
      I have read and agree <AppLink text="privacy policy" href={RouteNamesEnum.PrivacyPolicy} />
    </AppText>
  )
}
