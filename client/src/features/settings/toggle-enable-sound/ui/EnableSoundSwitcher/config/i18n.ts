import { type LocalizedTextType } from 'common-types'

export const ENABLE_SOUND_SWITCHER_TEXT = {
  label: {
    en: 'Sound',
    ru: 'Звук'
  },
  on: {
    en: 'On',
    ru: 'Вкл'
  },
  off: {
    en: 'Off',
    ru: 'Выкл'
  },
  tooltip: {
    en: 'The browser requires some kind of user action to activate the sound. Click anywhere to activate the audio context.',
    ru: 'Браузеру нужно действие пользователя, чтобы включить звук. Нажмите в любом месте, чтобы активировать аудиоконтекст.'
  }
} as const satisfies Record<string, LocalizedTextType>
