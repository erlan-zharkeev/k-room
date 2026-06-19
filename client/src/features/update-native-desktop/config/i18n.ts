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
    en: 'Install the desktop update and restart the app.',
    ru: 'Установите обновление desktop-клиента и перезапустите приложение.',
    zh: '安装桌面客户端更新并重启应用。'
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
