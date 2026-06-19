import { defineI18n } from 'src/shared/lib'

export const ONBOARDING_GUIDE_I18N = defineI18n('onboardingGuide', {
  navigationTitle: {
    en: 'Main navigation',
    ru: 'Главная навигация',
    zh: '主导航'
  },
  navigationText: {
    en: 'Switch between chats, calls, contacts and settings from here.',
    ru: 'Здесь можно переключаться между чатами, звонками, контактами и настройками.',
    zh: '在这里切换聊天、通话、联系人和设置。'
  },
  topBarTitle: {
    en: 'Profile and session',
    ru: 'Профиль и сессия',
    zh: '个人资料和会话'
  },
  topBarText: {
    en: 'Check connection status, active calls and account actions in the top bar.',
    ru: 'В верхней панели видны статус соединения, активные звонки и действия аккаунта.',
    zh: '在顶部栏查看连接状态、活动通话和账号操作。'
  },
  contentNavigationTitle: {
    en: 'Section list',
    ru: 'Список раздела',
    zh: '分区列表'
  },
  contentNavigationText: {
    en: 'This panel changes by section: chats, calls, contacts or settings.',
    ru: 'Эта панель меняется по разделу: чаты, звонки, контакты или настройки.',
    zh: '此面板会随分区变化：聊天、通话、联系人或设置。'
  },
  contentTitle: {
    en: 'Workspace',
    ru: 'Рабочая область',
    zh: '工作区'
  },
  contentText: {
    en: 'Open chats, manage calls and edit settings in the main workspace.',
    ru: 'В основной области открываются чаты, управление звонками и настройки.',
    zh: '在主工作区打开聊天、管理通话并编辑设置。'
  },
  back: {
    en: 'Back',
    ru: 'Назад',
    zh: '返回'
  },
  next: {
    en: 'Next',
    ru: 'Далее',
    zh: '下一步'
  },
  finish: {
    en: 'Done',
    ru: 'Готово',
    zh: '完成'
  },
  skip: {
    en: 'Skip',
    ru: 'Пропустить',
    zh: '跳过'
  }
})
