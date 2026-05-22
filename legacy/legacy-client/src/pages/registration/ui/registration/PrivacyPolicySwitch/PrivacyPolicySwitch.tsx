import './privacy-policy-switch.scss'

import { ROUTE_NAMES } from 'common'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import { AppLink, AppText } from 'src/shared/ui'

import { PRIVACY_POLICY_SWITCH_I18N } from './internals/i18n'
import { PrivacyPolicySwitchProps } from '../types'

export const PrivacyPolicySwitch = ({ disabled }: PrivacyPolicySwitchProps) => {
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
