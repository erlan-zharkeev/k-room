import { defineI18n, i18nFormatter } from 'src/shared/lib'

export const UPDATE_NATIVE_DESKTOP_I18N = defineI18n('updateNativeDesktop', {
  title: {
    en: i18nFormatter(
      ['appName', 'version'],
      (appName: string, version: string) => `${appName} ${version} is available`
    ),
    ru: i18nFormatter(['appName', 'version'], (appName: string, version: string) => `Доступен ${appName} ${version}`),
    zh: i18nFormatter(['appName', 'version'], (appName: string, version: string) => `${appName} ${version} 可用`)
  },
  description: {
    en: 'This update includes stability and performance improvements, along with general fixes.',
    ru: 'Обновление включает улучшения стабильности и производительности, а также общие исправления.',
    zh: '本次更新包含稳定性和性能改进，以及常规问题修复。'
  },
  installAction: {
    en: 'Update',
    ru: 'Обновить',
    zh: '更新'
  },
  dismissAction: {
    en: 'Later',
    ru: 'Позже',
    zh: '稍后'
  },
  installing: {
    en: i18nFormatter(['progress'], (progress: number) => `Installing: ${progress}%`),
    ru: i18nFormatter(['progress'], (progress: number) => `Установка: ${progress}%`),
    zh: i18nFormatter(['progress'], (progress: number) => `正在安装：${progress}%`)
  },
  installFailed: {
    en: 'Update failed. Try again later.',
    ru: 'Не удалось установить обновление. Попробуйте позже.',
    zh: '更新失败。请稍后再试。'
  }
})
