import { APP_LANGUAGE } from 'global-shared'

export const APP_EMOJI_PICKER_QUICK_EMOJI_LIST = [
  '\u{1F600}',
  '\u{1F602}',
  '\u{1F60D}',
  '\u{1F44D}',
  '\u{1F64F}',
  '\u{1F525}'
]

export const APP_EMOJI_PICKER_DATA_SOURCE_MAP = {
  [APP_LANGUAGE.En]: '/emoji/en.json',
  [APP_LANGUAGE.Ru]: '/emoji/ru.json',
  [APP_LANGUAGE.Zh]: '/emoji/zh.json'
}

export const EMOJI_PICKER_ELEMENT_SHADOW_STYLE_ID = 'app-emoji-picker-shadow-style'

export const EMOJI_PICKER_ELEMENT_SHADOW_STYLE = `
.emoji,
button.emoji {
  border-radius: 4px;
}

.skintone-button-wrapper,
.skintone-list {
  display: none;
}

.search-row {
  padding-inline-start: 0;
}

.search:focus {
  outline: 0;
}
`
