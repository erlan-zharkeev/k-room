import { ROUTE_NAMES } from 'common'

import { useI18n } from 'src/shared/preferences'

import { AppLink } from '../AppLink/AppLink'

import { PRIVACY_POLICY_LINK_I18N } from './i18n'

export const PrivacyPolicyLink = () => {
  const { t } = useI18n()

  return <AppLink to={ROUTE_NAMES.privacyPolicy} text={t(PRIVACY_POLICY_LINK_I18N.link)} />
}
