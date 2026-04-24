import { CLIENT_ENV } from 'src/shared/config'
import { useI18n } from 'src/shared/preferences'

import { AppLink } from '../AppLink/AppLink'

import { TECH_SUPPORT_LINK_I18N } from './i18n'

export const TechSupportLink = () => {
  const { t } = useI18n()
  const supportEmail = CLIENT_ENV.supportEmail

  return <AppLink text={t(TECH_SUPPORT_LINK_I18N.link)(supportEmail)} href={`mailto:${supportEmail}`} target="_self" />
}
