import { defineI18n, i18nFormatter } from 'src/shared/lib'

export const DOWNLOAD_PAGE_I18N = defineI18n('downloadPage', {
  title: {
    en: i18nFormatter(['appName'], (appName: string) => `Download ${appName}`),
    ru: i18nFormatter(['appName'], (appName: string) => `Скачать ${appName}`),
    zh: i18nFormatter(['appName'], (appName: string) => `下载 ${appName}`)
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
  downloadUnavailable: {
    en: 'The installer is not available yet.',
    ru: 'Установщик пока недоступен.',
    zh: '安装程序暂不可用。'
  },
  retry: {
    en: 'Retry',
    ru: 'Повторить',
    zh: '重试'
  },
  downloadAction: {
    en: i18nFormatter(['platformLabel'], (platformLabel: string) => `Download for ${platformLabel}`),
    ru: i18nFormatter(['platformLabel'], (platformLabel: string) => `Скачать для ${platformLabel}`),
    zh: i18nFormatter(['platformLabel'], (platformLabel: string) => `下载 ${platformLabel} 版本`)
  }
})
