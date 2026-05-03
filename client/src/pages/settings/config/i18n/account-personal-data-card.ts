export const SETTINGS_ACCOUNT_PERSONAL_DATA_CARD_I18N = {
  personalData: {
    en: 'Personal data',
    ru: 'Персональные данные',
    zh: '个人资料'
  },
  nickname: {
    en: 'Nickname',
    ru: 'Никнейм',
    zh: '昵称'
  },
  uploadPhoto: {
    en: 'Upload photo',
    ru: 'Загрузить фото',
    zh: '上传照片'
  },
  uploadPhotoHint: {
    en: (formats: string, maxMb: number) => `${formats} up to ${maxMb} MB`,
    ru: (formats: string, maxMb: number) => `${formats} до ${maxMb} МБ`,
    zh: (formats: string, maxMb: number) => `支持 ${formats}，最大 ${maxMb} MB`
  },
  resetPhoto: {
    en: 'Reset photo',
    ru: 'Сбросить фото',
    zh: '重置照片'
  },
  updateAccountData: {
    en: 'Update',
    ru: 'Обновить',
    zh: '更新'
  }
} as const
