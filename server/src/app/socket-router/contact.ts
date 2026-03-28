import {
  interlocutorPingController,
  saveContactController,
  searchContactController,
  updateContactInteractionTypeController
} from 'src/features/contact'

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
