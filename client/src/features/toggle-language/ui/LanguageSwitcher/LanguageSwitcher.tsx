import { useLanguageSetting } from 'src/features/toggle-language'

import { useI18n } from 'src/shared/preferences'
import { AppSwitch, AppText } from 'src/shared/ui'

import { LANGUAGE_SWITCHER_I18N } from './internals'

export const LanguageSwitcher = () => {
  const { toggleLanguage, isLangRu } = useLanguageSetting()
  const { t } = useI18n()

  return (
    <div className="language-switcher">
      <AppText size="small">{t(LANGUAGE_SWITCHER_I18N.label)}</AppText>
      <AppSwitch
        name="language"
        value={isLangRu()}
        onText={t(LANGUAGE_SWITCHER_I18N.ru)}
        offText={t(LANGUAGE_SWITCHER_I18N.en)}
        onChange={toggleLanguage}
      />
    </div>
  )
}
