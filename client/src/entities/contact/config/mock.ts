import { DbContactType } from 'src/shared/config'

export const MOCK: DbContactType[] = Array.from({ length: 50 }, (_, i) => {
  const id = (i + 1).toString()
  return {
    id,
    username: `User_${id}`,
    online: i % 2 === 0, // чётные онлайн
    lastSeen: 1010000000 + i * 1000,
    interactionType: i % 3 === 0 ? 'invite-accepted' : 'invite-received',
    onlineStatusSyncedAt: 10100000 + i * 500,
    isTyping: i % 5 === 0, // каждый пятый печатает
    savedAt: Date.now()
  }
})
