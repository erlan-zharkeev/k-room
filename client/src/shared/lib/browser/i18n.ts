import { defineI18n } from 'global-shared'

export const BROWSER_I18N = defineI18n({
  imageFormatNotAllowed: {
    en: 'Image format is not allowed',
    ru: 'Недопустимый формат изображения',
    zh: '图片格式不允许'
  },
  imageSizeMustBeLess: {
    en: (size: number) => `Image size must be less than ${size} MB`,
    ru: (size: number) => `Размер изображения должен быть меньше ${size} МБ`,
    zh: (size: number) => `图片大小必须小于 ${size} MB`
  }
})
