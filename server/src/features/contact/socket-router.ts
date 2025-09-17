import { SocketInstanceType } from 'shared-config'

import { controller as saveContactController } from './save-contact'
import { controller as searchContactController } from './search-contact'

const controllers = [searchContactController, saveContactController]

export const socketContactRouter = (socket: SocketInstanceType) => {
  controllers.forEach((controller) => controller(socket))
}