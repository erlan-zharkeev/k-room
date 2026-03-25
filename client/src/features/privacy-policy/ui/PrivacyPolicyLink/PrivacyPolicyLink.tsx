import { RouteNamesEnum } from 'common'

import { useI18n } from 'src/entities/system'

import { AppLink } from 'src/shared/ui'

import { LEGAL_INFO_LINK_I18N } from './config'

export const PrivacyPolicyLink = () => {
  const { t } = useI18n()

  return <AppLink to={RouteNamesEnum.PrivacyPolicy} text={t(LEGAL_INFO_LINK_I18N.link)} />
}
