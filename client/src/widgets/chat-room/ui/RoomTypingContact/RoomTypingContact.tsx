import './style.scss'

import { IRoomTypingContactProps } from 'src/widgets/chat-room'

import { useContact } from 'src/entities/contact'

import { AppDotsAnimatedText } from 'src/shared/ui'

export const RoomTypingContact = ({ room }: IRoomTypingContactProps) => {
  const { getByIds } = useContact()
  const searchedContacts = getByIds(room.users)

  const typingContact = searchedContacts.filter((contact) => contact.isTyping).map((contact) => contact.username)
  if (!typingContact.length) return null

  return (
    <div className="room-typing-contact">
      <AppDotsAnimatedText text={typingContact.join(', ')} />
    </div>
  )
}
