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
    en: i18nFormatter(['appName'], (appName: string) => `Install ${appName} on a phone or tablet`),
    ru: i18nFormatter(['appName'], (appName: string) => `Установить ${appName} на телефон или планшет`),
    zh: i18nFormatter(['appName'], (appName: string) => `在手机或平板电脑上安装 ${appName}`)
  },
  pwaAndroidInstallTitle: {
    en: i18nFormatter(['appName'], (appName: string) => `Install ${appName} on Android`),
    ru: i18nFormatter(['appName'], (appName: string) => `Установить ${appName} на Android`),
    zh: i18nFormatter(['appName'], (appName: string) => `在 Android 上安装 ${appName}`)
  },
  pwaIosInstallTitle: {
    en: i18nFormatter(['appName'], (appName: string) => `Install ${appName} on iOS or iPadOS`),
    ru: i18nFormatter(['appName'], (appName: string) => `Установить ${appName} на iOS или iPadOS`),
    zh: i18nFormatter(['appName'], (appName: string) => `在 iOS 或 iPadOS 上安装 ${appName}`)
  },
  pwaAndroidInstallHelp: {
    en: 'Open this site in Chrome and follow these steps.',
    ru: 'Откройте этот сайт в Chrome и выполните следующие действия.',
    zh: '在 Chrome 中打开此网站，然后按照以下步骤操作。'
  },
  pwaIosInstallHelp: {
    en: 'Open this site in Safari and follow these steps.',
    ru: 'Откройте этот сайт в Safari и выполните следующие действия.',
    zh: '在 Safari 中打开此网站，然后按照以下步骤操作。'
  },
  pwaStepMenu: {
    en: 'Menu',
    ru: 'Меню',
    zh: '菜单'
  },
  pwaStepMore: {
    en: 'More',
    ru: 'Ещё',
    zh: '更多'
  },
  pwaStepInstall: {
    en: 'Install and create shortcut',
    ru: 'Установить и создать ярлык',
    zh: '安装并创建快捷方式'
  },
  pwaStepConfirm: {
    en: 'Confirm',
    ru: 'Подтвердить',
    zh: '确认'
  },
  pwaStepShare: {
    en: 'Share',
    ru: 'Поделиться',
    zh: '分享'
  },
  pwaStepHomeScreen: {
    en: 'Add to Home Screen',
    ru: 'На экран «Домой»',
    zh: '添加到主屏幕'
  },
  pwaStepAdd: {
    en: 'Add',
    ru: 'Добавить',
    zh: '添加'
  }
})
