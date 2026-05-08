import ruI18n from 'emoji-picker-element/i18n/ru_RU'
import zhI18n from 'emoji-picker-element/i18n/zh_CN'
import { APP_LANGUAGE } from 'global-shared'

export const APP_EMOJI_PICKER_QUICK_EMOJI_LIST = ['😀', '😂', '😍', '👍', '🙏', '🔥', '🎉', '❤️']

export const APP_EMOJI_PICKER_DATA_SOURCE_MAP = {
  [APP_LANGUAGE.En]: '/emoji/en.json',
  [APP_LANGUAGE.Ru]: '/emoji/ru.json',
  [APP_LANGUAGE.Zh]: '/emoji/zh.json'
}

export const APP_EMOJI_PICKER_I18N_MAP = {
  [APP_LANGUAGE.Ru]: ruI18n,
  [APP_LANGUAGE.Zh]: zhI18n
}
