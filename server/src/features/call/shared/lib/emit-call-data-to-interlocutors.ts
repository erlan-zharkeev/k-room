import type { EventCallUpdatedType, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { getIO } from 'src/shared/lib'

import { transformCallForUser } from '.'

export const emitCallDataToInterlocutors = async (interlocutors: string[], callId: string, setId?: boolean) => {
  await Promise.all(
    interlocutors.map(async (interlocutorId) => {
      const transformedCall = await transformCallForUser(interlocutorId, callId)

      if (!transformedCall) return

      const payload: EventCallUpdatedType = {
        ...transformedCall,
        setId
      }

      const socketIds = await getSocketsByUserIds([interlocutorId])

      socketIds.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('call-data-changed', payload)
      })
    })
  )
}
