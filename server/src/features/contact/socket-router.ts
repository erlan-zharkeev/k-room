import { SocketInstanceType } from 'shared-config'

import { controller as saveContactController } from './save-contact'
import { controller as searchContactController } from './search-contact'
import { controller as updateContactInteractionTypeController } from './update-contact-interaction-type'

const controllers = [searchContactController, saveContactController, updateContactInteractionTypeController]

export const socketContactRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}