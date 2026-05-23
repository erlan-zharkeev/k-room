import { CONTACT_INTERACTION } from '../constants'
import type { Interaction } from '../types'

export const isDefaultContactInteraction = (interaction?: Interaction) => interaction === CONTACT_INTERACTION.DEFAULT

export const isInvitedContactInteraction = (interaction?: Interaction) => interaction === CONTACT_INTERACTION.INVITED

export const isInviteReceivedContactInteraction = (interaction?: Interaction) =>
  interaction === CONTACT_INTERACTION.INVITE_RECEIVED

export const isAcceptedContactInteraction = (interaction?: Interaction) =>
  interaction === CONTACT_INTERACTION.INVITE_ACCEPTED

export const isBlockedContactInteraction = (interaction?: Interaction) => interaction === CONTACT_INTERACTION.BLOCKED

export const isPendingContactInteraction = (interaction?: Interaction) =>
  isInvitedContactInteraction(interaction) || isInviteReceivedContactInteraction(interaction)
