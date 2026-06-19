import { defineI18n } from 'src/shared/lib'

export const SELECT_THEME_I18N = defineI18n('selectTheme', {
  selectTheme: {
    en: 'Select theme',
    ru: 'Выбор темы',
    zh: '选择主题'
  },
  customTheme: {
    en: 'Custom',
    ru: 'Кастомная',
    zh: '自定义'
  },
  darkTheme: {
    en: 'Dark',
    ru: 'Темная',
    zh: '深色'
  },
  systemTheme: {
    en: 'System',
    ru: 'Системная',
    zh: '系统'
  },
  lightTheme: {
    en: 'Light',
    ru: 'Светлая',
    zh: '浅色'
  }
})
