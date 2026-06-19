import type { Interaction } from './types'

export const isDefaultContactInteraction = (interaction?: Interaction) => interaction === 'default'

export const isInvitedContactInteraction = (interaction?: Interaction) => interaction === 'invited'

export const isInviteReceivedContactInteraction = (interaction?: Interaction) => interaction === 'invite-received'

export const isAcceptedContactInteraction = (interaction?: Interaction) => interaction === 'invite-accepted'

export const isBlockedContactInteraction = (interaction?: Interaction) => interaction === 'blocked'

export const isPendingContactInteraction = (interaction?: Interaction) =>
  isInvitedContactInteraction(interaction) || isInviteReceivedContactInteraction(interaction)
