import { ChatRoomModel } from './../../models/chatRoom.model'

export const getRoomsByHasContact = async (contactId: string) => await ChatRoomModel.find({ 'users.id': contactId })

export default getRoomsByHasContact
