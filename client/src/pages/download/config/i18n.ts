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
  },
  windowsInstallHelp: {
    en: 'On Windows, click PC and open K-Room-Setup.exe from Downloads. If SmartScreen says Windows protected your PC or shows an unknown publisher warning, click More info, then Run anyway, and follow the installer.',
    ru: 'На Windows нажмите PC и откройте K-Room-Setup.exe из папки загрузок. Если SmartScreen покажет предупреждение Windows protected your PC или unknown publisher, нажмите More info, затем Run anyway и следуйте установщику.',
    zh: '在 Windows 上，点击 PC，然后从下载文件夹打开 K-Room-Setup.exe。如果 SmartScreen 显示 Windows protected your PC 或未知发布者警告，请点击 More info，再点击 Run anyway，然后按安装程序提示继续。'
  },
  macosInstallHelp: {
    en: 'On Mac, click Mac, open K-Room.dmg, then drag K-Room to Applications. If macOS says the app cannot be opened because the developer cannot be verified, open System Settings > Privacy & Security, click Open Anyway, then Open.',
    ru: 'На Mac нажмите Mac, откройте K-Room.dmg и перетащите K-Room в Applications. Если macOS скажет, что приложение нельзя открыть, потому что разработчик не проверен, откройте System Settings > Privacy & Security, нажмите Open Anyway, затем Open.',
    zh: '在 Mac 上，点击 Mac，打开 K-Room.dmg，然后把 K-Room 拖到 Applications。如果 macOS 提示无法打开，因为无法验证开发者，请打开 System Settings > Privacy & Security，点击 Open Anyway，然后点击 Open。'
  },
  pwaInstallTitle: {
    en: i18nFormatter(['appName'], (appName: string) => `Install ${appName} on a phone`),
    ru: i18nFormatter(['appName'], (appName: string) => `Установить ${appName} на телефон`),
    zh: i18nFormatter(['appName'], (appName: string) => `在手机上安装 ${appName}`)
  },
  pwaAndroidInstallHelp: {
    en: 'Open this site in Chrome, tap the menu, choose Install app or Add to Home screen, then confirm.',
    ru: 'Откройте этот сайт в Chrome, нажмите меню, выберите «Установить приложение» или «Добавить на главный экран», затем подтвердите.',
    zh: '在 Chrome 中打开此网站，点按菜单，选择“安装应用”或“添加到主屏幕”，然后确认。'
  },
  pwaIosInstallHelp: {
    en: 'Open this site in Safari, tap Share, choose Add to Home Screen, then tap Add.',
    ru: 'Откройте этот сайт в Safari, нажмите «Поделиться», выберите «На экран “Домой”», затем нажмите «Добавить».',
    zh: '在 Safari 中打开此网站，点按“分享”，选择“添加到主屏幕”，然后点按“添加”。'
  },
  pwaAutoInstallNote: {
    en: 'A mobile PWA cannot be installed automatically from a link. Browsers require a user action and confirmation.',
    ru: 'Мобильную PWA нельзя установить автоматически по ссылке. Браузеры требуют действие пользователя и подтверждение.',
    zh: '移动端 PWA 不能通过链接自动安装。浏览器需要用户操作和确认。'
  }
})
