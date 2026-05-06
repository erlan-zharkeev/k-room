export const SETTINGS_ACCOUNT_PERSONAL_DATA_I18N = {
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
  uploadPhotoRequirements: {
    en: 'Photo requirements',
    ru: 'Требования к фото',
    zh: '照片要求'
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
  },
  nicknameCopied: {
    en: 'Nickname copied to clipboard',
    ru: 'Никнейм скопирован в буфер обмена',
    zh: '昵称已复制到剪贴板'
  },
  userIdCopied: {
    en: 'User ID copied to clipboard',
    ru: 'ID скопирован в буфер обмена',
    zh: '用户 ID 已复制到剪贴板'
  }
} as const
