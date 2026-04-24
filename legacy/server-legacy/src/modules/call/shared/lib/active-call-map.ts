const activeCallInterlocutorMap = new Map<string, string>()

export const setActiveCallInterlocutor = (userId: string, interlocutorId: string) => {
  activeCallInterlocutorMap.set(userId, interlocutorId)
}

export const getActiveCallInterlocutor = (userId: string) => activeCallInterlocutorMap.get(userId) ?? null

export const clearActiveCallInterlocutor = (userId: string) => {
  activeCallInterlocutorMap.delete(userId)
}
