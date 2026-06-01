import { defineI18n } from 'global-shared'

export const ROOM_CALLS_I18N = defineI18n({
  roomCallAlreadyActive: {
    en: 'A call is already active in this chat',
    ru: 'В этом чате уже идет звонок',
    zh: '此聊天中已有正在进行的通话'
  },
  roomCallJoinFailed: {
    en: 'Failed to join call',
    ru: 'Не удалось присоединиться к звонку',
    zh: '加入通话失败'
  },
  roomCallLimitReached: {
    en: 'Call participant limit reached',
    ru: 'Достигнут лимит участников звонка',
    zh: '已达到通话参与者上限'
  },
  roomCallStartFailed: {
    en: 'Failed to start call in this chat',
    ru: 'Не удалось начать звонок в этом чате',
    zh: '无法在此聊天中发起通话'
  }
})
