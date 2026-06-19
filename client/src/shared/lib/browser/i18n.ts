import { defineI18n, i18nFormatter } from '../i18n/define-i18n'

export const BROWSER_I18N = defineI18n('browser', {
  imageFormatNotAllowed: {
    en: 'Image format is not allowed',
    ru: 'Недопустимый формат изображения',
    zh: '图片格式不允许'
  },
  imageSizeMustBeLess: {
    en: i18nFormatter(['size'], (size: number) => `Image size must be less than ${size} MB`),
    ru: i18nFormatter(['size'], (size: number) => `Размер изображения должен быть меньше ${size} МБ`),
    zh: i18nFormatter(['size'], (size: number) => `图片大小必须小于 ${size} MB`)
  }
})
