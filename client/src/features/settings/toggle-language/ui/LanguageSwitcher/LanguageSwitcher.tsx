import { useLanguageSetting } from 'src/features/settings'

import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText } from 'src/shared/ui'

import { LANGUAGE_SWITCHER_I18N } from './config'

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
