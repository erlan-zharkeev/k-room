import { defineI18n } from 'global-shared'

export const DOWNLOAD_PAGE_I18N = defineI18n({
  title: {
    en: (appName: string) => `Download ${appName}`,
    ru: (appName: string) => `Скачать ${appName}`,
    zh: (appName: string) => `下载 ${appName}`
  },
  description: {
    en: 'Choose the desktop installer for your operating system.',
    ru: 'Выберите установщик для вашей операционной системы.',
    zh: '选择适合您操作系统的桌面安装程序。'
  },
  versionLabel: {
    en: 'Version',
    ru: 'Версия',
    zh: '版本'
  },
  releasedLabel: {
    en: 'Released',
    ru: 'Релиз',
    zh: '发布日期'
  },
  loading: {
    en: 'Loading download options...',
    ru: 'Загружаем варианты скачивания...',
    zh: '正在加载下载选项...'
  },
  error: {
    en: 'Could not load download options.',
    ru: 'Не удалось загрузить варианты скачивания.',
    zh: '无法加载下载选项。'
  },
  retry: {
    en: 'Retry',
    ru: 'Повторить',
    zh: '重试'
  },
  downloadAction: {
    en: (platformLabel: string) => `Download for ${platformLabel}`,
    ru: (platformLabel: string) => `Скачать для ${platformLabel}`,
    zh: (platformLabel: string) => `下载 ${platformLabel} 版本`
  }
})
