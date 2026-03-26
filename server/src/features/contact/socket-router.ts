import { controller as interlocutorPingController } from 'features/contact/interlocutor-ping'
import { controller as saveContactController } from 'features/contact/save-contact'
import { controller as searchContactController } from 'features/contact/search-contact'
import { controller as updateContactInteractionTypeController } from 'features/contact/update-contact-interaction-type'

import { SocketInstanceType } from 'shared-config'

const controllers = [searchContactController, saveContactController, interlocutorPingController, updateContactInteractionTypeController]

export const socketContactRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
