import { defineI18n } from 'global-shared'

export const NATIVE_DESKTOP_UPDATE_I18N = defineI18n({
  title: {
    en: (version: string) => `K-Room ${version} is available`,
    ru: (version: string) => `Доступен K-Room ${version}`,
    zh: (version: string) => `K-Room ${version} 可用`
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
    en: (progress: number) => `Installing: ${progress}%`,
    ru: (progress: number) => `Установка: ${progress}%`,
    zh: (progress: number) => `正在安装：${progress}%`
  },
  installFailed: {
    en: 'Update failed. Try again later.',
    ru: 'Не удалось установить обновление. Попробуйте позже.',
    zh: '更新失败。请稍后再试。'
  }
})
