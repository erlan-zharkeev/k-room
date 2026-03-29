import { APP_LANGUAGE } from 'common'

import { useLanguageSetting } from 'src/features/settings/toggle-language'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText } from 'src/shared/ui'

const TEXT = {
  label: {
    en: 'Language',
    ru: 'Язык'
  },
  en: {
    en: 'EN',
    ru: 'EN'
  },
  ru: {
    en: 'RU',
    ru: 'RU'
  }
} as const

export const LanguageSwitcher = () => {
  const { language } = useSettings()
  const { toggleLanguage } = useLanguageSetting()
  const { t } = useI18n()

  return (
    <div className="language-switcher">
      <AppText size="small">{t(TEXT.label)}</AppText>
      <AppSwitch
        name="language"
        value={language === APP_LANGUAGE.Ru}
        onText={t(TEXT.ru)}
        offText={t(TEXT.en)}
        onChange={toggleLanguage}
      />
    </div>
  )
}
