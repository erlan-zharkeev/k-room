import { IFrontendContact } from 'common'

import { IContact } from '../../types'
import { UserModel } from '../../user.model'

export const transformUserToFrontendContact = async (
  contacts: Record<string, IContact>
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
