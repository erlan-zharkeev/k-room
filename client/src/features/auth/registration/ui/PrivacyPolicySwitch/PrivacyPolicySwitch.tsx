import './style.scss'

import { RouteNamesEnum } from 'common'

import type { IPrivacyPolicySwitchProps } from 'src/features/auth/registration'
import { PRIVACY_POLICY_SWITCH_I18N } from 'src/features/auth/registration'

import { useI18n } from 'src/entities/settings'

import { createClassNameWithModifiers } from 'src/shared/lib'
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
      <AppLink text={t(PRIVACY_POLICY_SWITCH_I18N.link)} to={RouteNamesEnum.PrivacyPolicy} />
    </AppText>
  )
}
