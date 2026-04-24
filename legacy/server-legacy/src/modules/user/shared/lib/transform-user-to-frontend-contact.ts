import { IFrontendContact, InteractionType } from 'common'

import { IUserSchema } from '../../types'

export const transformUserToContact = (
  user: IUserSchema,
  interactionType: InteractionType = 'default'
): IFrontendContact => {
  const { lastSeen, online } = user.public
  return {
    id: user._id,
    username: user.public.username,
    interactionType,
    online,
    lastSeen
  }
}
