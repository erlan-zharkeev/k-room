import { defineI18n } from 'src/shared/lib'

export const APP_WELCOME_I18N = defineI18n('appWelcome', {
  title: {
    en: 'Welcome to K Room',
    ru: 'Добро пожаловать в K Room',
    zh: '欢迎来到 K Room'
  },
  description: {
    en: 'K Room keeps chats, calls, and shared spaces in one calm interface. It helps you stay close to people and return to the right context quickly. Start from the main screen, and tune the details later.',
    ru: 'K Room собирает чаты, звонки и рабочие пространства в одном спокойном интерфейсе. Здесь удобно держать связь с людьми и быстро возвращаться к нужному контексту. Начни с главного экрана, а детали можно настроить позже.',
    zh: 'K Room 将聊天、通话和共享空间放在一个安静的界面中。它帮助你与重要的人保持联系，并快速回到需要的上下文。先从主屏幕开始，细节可以稍后再调整。'
  },
  action: {
    en: 'Continue',
    ru: 'Продолжить',
    zh: '继续'
  },
  imageAlt: {
    en: 'K Room welcome illustration',
    ru: 'Приветственная иллюстрация K Room',
    zh: 'K Room 欢迎插图'
  }
})
