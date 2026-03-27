import './style.scss'

import type { IRoomTypingContactProps } from 'src/widgets/chat-room/ui/RoomTypingContact/config'

import { useContact } from 'src/entities/contact'

import { AppDotsAnimatedText } from 'src/shared/ui'

export const RoomTypingContact = ({ room }: IRoomTypingContactProps) => {
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
