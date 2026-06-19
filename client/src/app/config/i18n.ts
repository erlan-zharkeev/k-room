import { defineI18n } from 'src/shared/lib'

export const APP_I18N = defineI18n('app', {
  unsupportedResolutionTitle: {
    en: 'Resolution is not supported',
    ru: 'Разрешение не поддерживается',
    zh: '不支持此分辨率'
  },
  unsupportedResolutionDescription: {
    en: 'Use a screen at least 320 x 350 px.',
    ru: 'Используйте экран не меньше 320 x 350 px.',
    zh: '请使用至少 320 x 350 px 的屏幕。'
  }
})
