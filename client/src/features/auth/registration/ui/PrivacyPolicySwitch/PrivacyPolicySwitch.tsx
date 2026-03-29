import './style.scss'

import { RouteNamesEnum } from 'common'

import { useI18n } from 'src/entities/system'

import { AppLink, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import type { IPrivacyPolicySwitchProps } from '../..'
import { PRIVACY_POLICY_SWITCH_I18N } from '../..'

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
