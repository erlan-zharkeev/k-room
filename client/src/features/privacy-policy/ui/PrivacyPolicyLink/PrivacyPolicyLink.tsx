import { RouteNamesEnum } from 'common'

import { LEGAL_INFO_LINK_I18N } from 'src/features/privacy-policy/config'

import { useI18n } from 'src/entities/settings'

import { AppLink } from 'src/shared/ui'

export const PrivacyPolicyLink = () => {
  const { t } = useI18n()

  return <AppLink to={RouteNamesEnum.PrivacyPolicy} text={t(LEGAL_INFO_LINK_I18N.link)} />
}
