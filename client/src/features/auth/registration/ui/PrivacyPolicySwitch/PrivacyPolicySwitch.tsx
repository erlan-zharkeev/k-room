import './style.scss'

import { ROUTE_NAMES } from 'common'

import { IPrivacyPolicySwitchProps, PRIVACY_POLICY_SWITCH_I18N } from 'src/features/auth'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useI18n } from 'src/shared/settings'
import { AppLink, AppText } from 'src/shared/ui'

export const PrivacyPolicySwitch = ({ disabled }: IPrivacyPolicySwitchProps) => {
  const { t } = useI18n()
  const className = createClassNameWithModifiers({
    rootClass: 'privacy-policy-switch',
    modifiers: [disabled && 'disabled']
  })

  return (
    <AppText additionalClassName={className} size="small">
      {t(PRIVACY_POLICY_SWITCH_I18N.agreement)}{' '}
      <AppLink text={t(PRIVACY_POLICY_SWITCH_I18N.link)} to={ROUTE_NAMES.privacyPolicy} />
    </AppText>
  )
}
