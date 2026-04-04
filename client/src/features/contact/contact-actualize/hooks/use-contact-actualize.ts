import { IFrontendContact, SocketActionsType } from 'common'

import { getRequiredContactSystemData } from 'src/features/contact'

import { useContact } from 'src/entities/contact'

import { socket } from 'src/shared/api'
import { DbContactType } from 'src/shared/config'

export const useContactActualize = () => {
  const { mergeMany } = useContact()

  const actualizeContacts = async (contacts: IFrontendContact[]) => {
    await mergeMany(contacts as DbContactType[], {
      merge: (current, incoming) => {
        if (current) {
          return {
            ...current,
            ...incoming,
            onlineStatusSyncedAt: Date.now()
          }
        }

        return {
          ...incoming,
          ...getRequiredContactSystemData()
        }
      },
      removeMissing: true
    })
  }

  const monitorContactsActualize = () => {
    socket.on<SocketActionsType>('actual-contacts', actualizeContacts)
  }

  return { monitorContactsActualize }
}
