import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import type { RoomCallDocument } from '../room-calls.types'

export const transformRoomCall = ({ _id, ...roomCall }: RoomCallDocument) => ({
  ...roomCall,
  id: stringifyMongoId(_id)
})
