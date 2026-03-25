import type { IFrontendContact, InteractionType } from "common"

import type { IUserSchema } from "entities/user"

export const transformUserToContact = (user: IUserSchema, interactionType: InteractionType = 'default'): IFrontendContact => {
  const { lastSeen, online } = user.public
  return {
    id: user._id,
    username: user.public.username,
    interactionType,
    online,
    lastSeen
  }
}
