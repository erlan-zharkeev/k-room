import { ROUTE_NAMES } from 'global-shared'

export const MAIN_PAGE_ROUTES = {
  chatRooms: `${ROUTE_NAMES.main}/chat-rooms`,
  calls: `${ROUTE_NAMES.main}/calls`,
  contacts: `${ROUTE_NAMES.main}/contacts`,
  info: `${ROUTE_NAMES.main}/info`,
  settings: `${ROUTE_NAMES.main}/settings`
} as const

export const MAIN_PAGE_NAV_ITEMS = [
  {
    id: 'chatRooms',
    path: MAIN_PAGE_ROUTES.chatRooms,
    label: 'Чаты',
    icon: 'pi pi-comments'
  },
  {
    id: 'calls',
    path: MAIN_PAGE_ROUTES.calls,
    label: 'Звонки',
    icon: 'pi pi-phone'
  },
  {
    id: 'contacts',
    path: MAIN_PAGE_ROUTES.contacts,
    label: 'Контакты',
    icon: 'pi pi-users'
  },
  {
    id: 'info',
    path: MAIN_PAGE_ROUTES.info,
    label: 'События',
    icon: 'pi pi-bell',
    badge: 3
  },
  {
    id: 'settings',
    path: MAIN_PAGE_ROUTES.settings,
    label: 'Настройки',
    icon: 'pi pi-cog'
  }
] as const

export const MAIN_PAGE_SIDE_PANEL_ITEMS = {
  chatRooms: [
    { title: 'Design room', detail: 'Последнее сообщение' },
    { title: 'Release channel', detail: 'Планирование версии' },
    { title: 'Support', detail: 'Вопросы команды' }
  ],
  calls: [
    { title: 'Daily sync', detail: 'Сегодня, 10:00' },
    { title: 'Product review', detail: 'Вчера, 16:30' },
    { title: 'Support call', detail: 'Понедельник, 12:15' }
  ],
  contacts: [
    { title: 'Aruzhan Kaiyr', detail: 'online' },
    { title: 'Erlan Zharkeev', detail: '5 минут назад' },
    { title: 'Tolganay Sapar', detail: 'offline' }
  ],
  info: [
    { title: 'Welcome', detail: 'Новое уведомление' },
    { title: 'Security', detail: 'Проверьте сессию' },
    { title: 'System', detail: 'Синхронизация завершена' }
  ],
  settings: [
    { title: 'Profile', detail: 'Аккаунт' },
    { title: 'Devices', detail: 'Камера и микрофон' },
    { title: 'Appearance', detail: 'Тема и интерфейс' }
  ]
} as const

export const MAIN_PAGE_CONTENT_ITEMS = {
  chatRooms: {
    title: 'Design room',
    detail: 'Активный диалог',
    icon: 'pi pi-comments'
  },
  calls: {
    title: 'Daily sync',
    detail: 'Журнал звонков',
    icon: 'pi pi-phone'
  },
  contacts: {
    title: 'Aruzhan Kaiyr',
    detail: 'Карточка контакта',
    icon: 'pi pi-user'
  },
  info: {
    title: 'Welcome',
    detail: 'Центр уведомлений',
    icon: 'pi pi-bell'
  },
  settings: {
    title: 'Profile',
    detail: 'Параметры приложения',
    icon: 'pi pi-cog'
  }
} as const
