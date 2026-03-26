
import { TECH_SUPPORT_LINK_I18N } from 'src/features/support/ui/TechSupportLink/config'

import { useI18n } from 'src/entities/system'

import { CLIENT_ENV } from 'src/shared/config'
import { AppLink } from 'src/shared/ui'

export const TechSupportLink = () => {
  const { t } = useI18n()
  const supportEmail = CLIENT_ENV.supportEmail

  return <AppLink text={t(TECH_SUPPORT_LINK_I18N.link)(supportEmail)} href={`mailto:${supportEmail}`} target="_self" />
}
