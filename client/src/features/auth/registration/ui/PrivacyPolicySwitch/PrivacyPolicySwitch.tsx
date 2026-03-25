import './style.scss'

import { RouteNamesEnum } from 'common-types'

import { PRIVACY_POLICY_SWITCH_TEXT } from 'src/features/auth/registration/ui/PrivacyPolicySwitch/config'

import { useI18n } from 'src/entities/system'

import { AppLink, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const PrivacyPolicySwitch = ({ disabled }: { disabled: boolean }) => {
  const { t } = useI18n()
  const className = createClassNameWithModifiers({
    rootClass: 'privacy-policy-switch',
    modifiers: [disabled && 'disabled']
  })

  return (
    <AppText additionalClassName={className} size="small">
      {t(PRIVACY_POLICY_SWITCH_TEXT.agreement)}{' '}
      <AppLink text={t(PRIVACY_POLICY_SWITCH_TEXT.link)} to={RouteNamesEnum.PrivacyPolicy} />
    </AppText>
  )
}
