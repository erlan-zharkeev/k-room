import { IFrontendContact } from 'common'

import { UserContact } from '../../types'
import { UserModel } from '../../user.model'

export const transformUserToFrontendContact = async (
  contacts: Record<string, UserContact>
): Promise<IFrontendContact[]> => {
  const result: IFrontendContact[] = []
  for (const [id, data] of Object.entries(contacts)) {
    const user = await UserModel.findById(id).lean()
    if (user) {
      const { username, online, lastSeen } = user.public
      result.push({
        id,
        username: username,
        online: online,
        lastSeen: lastSeen,
        interactionType: data.interaction
      })
    }
  }
  return result
}
