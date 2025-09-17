import type { FrontendContactType, InteractionType } from "common-types"
import type { IUserSchema } from "entities/user"

export const transformUserToContact = (user: IUserSchema, interactionType: InteractionType = 'default'): FrontendContactType => {
  return {
    id: user.id,
    username: user.public.username,
    interactionType
  }
}
