import { defineI18n } from 'src/shared/lib'

export const API_I18N = defineI18n('api', {
  operationFailed: {
    en: 'Failed to perform operation. Please try again later.',
    ru: 'Не удалось выполнить операцию. Попробуйте позже.',
    zh: '操作失败。请稍后重试。'
  },
  clientUpdateTitle: {
    en: 'Update available',
    ru: 'Доступно обновление',
    zh: '有可用更新'
  },
  clientUpdateContent: {
    en: 'The app will reload to apply the update.',
    ru: 'Приложение перезагрузится для применения обновления.',
    zh: '应用将重新加载以应用更新。'
  }
})
