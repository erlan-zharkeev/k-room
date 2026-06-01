import { defineI18n } from 'global-shared'

export const ROOM_CALLS_I18N = defineI18n({
  roomCallAccessFailed: {
    en: 'Failed to access call',
    ru: 'Нет доступа к звонку',
    zh: '无法访问通话'
  },
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
  roomCallLeaveFailed: {
    en: 'Failed to leave call',
    ru: 'Не удалось выйти из звонка',
    zh: '退出通话失败'
  },
  roomCallLimitReached: {
    en: 'Call participant limit reached',
    ru: 'Достигнут лимит участников звонка',
    zh: '已达到通话参与者上限'
  },
  roomCallSignalFailed: {
    en: 'Failed to send call signal',
    ru: 'Не удалось отправить сигнал звонка',
    zh: '发送通话信令失败'
  },
  roomCallStartFailed: {
    en: 'Failed to start call in this chat',
    ru: 'Не удалось начать звонок в этом чате',
    zh: '无法在此聊天中发起通话'
  },
  roomCallUpdateMediaStateFailed: {
    en: 'Failed to update call media state',
    ru: 'Не удалось обновить медиа-состояние звонка',
    zh: '更新通话媒体状态失败'
  }
})
