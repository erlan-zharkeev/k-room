import { controller as interlocutorPingController } from 'src/features/contact/interlocutor-ping'
import { controller as saveContactController } from 'src/features/contact/save-contact'
import { controller as searchContactController } from 'src/features/contact/search-contact'
import { controller as updateContactInteractionTypeController } from 'src/features/contact/update-contact-interaction-type'
import { SocketInstanceType } from 'src/shared/config'

const controllers = [
  searchContactController,
  saveContactController,
  interlocutorPingController,
  updateContactInteractionTypeController
]

export const socketContactRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}
