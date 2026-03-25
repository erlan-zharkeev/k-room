import './style.scss'

import { IChatRoom } from 'common'

import { useContact } from 'src/entities/contact'

import { AppDotsAnimatedText } from 'src/shared/ui'

export const RoomTypingContact = ({ room }: { room: IChatRoom }) => {
  const { getContactByIds } = useContact()
  const searchedContacts = getContactByIds(room.users)

  const typingContact = searchedContacts.filter((contact) => contact.isTyping).map((contact) => contact.username)
  if (!typingContact.length) return null

  return (
    <div className="room-typing-contact">
      <AppDotsAnimatedText text={typingContact.join(', ')} />
    </div>
  )
}
