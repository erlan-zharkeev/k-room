import { IFrontendContact, Interaction } from 'common'

import { UserSchema } from '../../types'

export const transformUserToContact = (
  user: UserSchema,
  interactionType: Interaction = 'default'
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
