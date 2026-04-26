import { defineI18n } from 'global-shared'

export const ERROR_PAGE_I18N = defineI18n({
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  },
  description: {
    en: 'The page does not exist or has been moved.',
    ru: 'Страница не существует или была перемещена.',
    zh: '页面不存在或已被移动。'
  },
  toMain: {
    en: 'Go to main page',
    ru: 'Перейти на главную',
    zh: '前往主页'
  },
  title: {
    en: 'Page not found',
    ru: 'Страница не найдена',
    zh: '页面未找到'
  }
})
