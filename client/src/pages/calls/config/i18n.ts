import { defineI18n, formatPlural } from 'global-shared'

export const CALLS_PAGE_I18N = defineI18n({
  noCalls: {
    en: 'No calls yet',
    ru: 'Звонков пока нет',
    zh: '暂无通话'
  },
  activeCall: {
    en: 'Active',
    ru: 'Активный',
    zh: '进行中'
  },
  finishedCall: {
    en: 'Finished',
    ru: 'Завершен',
    zh: '已结束'
  },
  missedCall: {
    en: 'Missed',
    ru: 'Пропущен',
    zh: '未接'
  },
  audioCall: {
    en: 'Audio',
    ru: 'Аудио',
    zh: '语音'
  },
  videoCall: {
    en: 'Video',
    ru: 'Видео',
    zh: '视频'
  },
  screenCall: {
    en: 'Screen',
    ru: 'Экран',
    zh: '屏幕'
  },
  unknownRoom: {
    en: 'Unknown chat',
    ru: 'Неизвестный чат',
    zh: '未知聊天'
  },
  callParticipants: {
    en: (quantity: number) => formatPlural('en', quantity, { one: 'participant', other: 'participants' }),
    ru: (quantity: number) =>
      formatPlural('ru', quantity, {
        few: 'участника',
        many: 'участников',
        one: 'участник',
        other: 'участника'
      }),
    zh: (quantity: number) => formatPlural('zh', quantity, { other: '位参与者' })
  }
})
