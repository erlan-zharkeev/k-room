import { APP_LANGUAGE } from 'global-shared'

export const EMOJI_PICKER_QUICK_LIST_LIMIT = 6

export const DEFAULT_EMOJI_PICKER_QUICK_LIST = [
  '\u{1F600}',
  '\u{1F602}',
  '\u{1F60D}',
  '\u{1F44D}',
  '\u{1F64F}',
  '\u{1F525}'
]

export const EMOJI_PICKER_DATA_SOURCE_URL_BY_LANGUAGE = {
  [APP_LANGUAGE.En]: '/emoji/en.json',
  [APP_LANGUAGE.Ru]: '/emoji/ru.json',
  [APP_LANGUAGE.Zh]: '/emoji/zh.json'
}

export const EMOJI_PICKER_CATEGORY_LABELS = {
  0: '\u{1F600}',
  1: '\u{1F44B}',
  2: '\u{1F43B}',
  3: '\u{1F354}',
  4: '\u{2708}\u{FE0F}',
  5: '\u{26BD}',
  6: '\u{1F4A1}',
  7: '\u{2764}\u{FE0F}',
  8: '\u{1F3C1}',
  9: '\u{1F3F4}'
}
