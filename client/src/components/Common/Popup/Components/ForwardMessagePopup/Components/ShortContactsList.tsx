import { useEffect, useState } from 'react'
import UIAvatar from 'src/components/UI/UIAvatar'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { ShortContactsListProps } from './@types'

const ShortContactsList = ({ searchString, clickContact }: ShortContactsListProps) => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const [filteredContacts, setFilteredContacts] = useState(contacts)

  useEffect(() => {
    const updatedContacts = contacts.filter((contact) => {
      const username = contact.username.toLowerCase()
      const searchParams = searchString.toLowerCase()
      const match = username.indexOf(searchParams) > -1
      if (match) return contact
    })
    setFilteredContacts(updatedContacts)
  }, [searchString])

  return (
    <div className="short-contacts-list">
      {filteredContacts.map((contact) => (
        <div className="short-contacts-list__item" key={contact.id} onClick={() => clickContact(contact.id)}>
          <UIAvatar showBadge={false} src={contact.avatar} />
          <span className="paragraph-text paragraph-text--secondary short-contacts-list__name">{contact.username}</span>
        </div>
      ))}
      {filteredContacts.length <= 0 && (
        <div className="paragraph-text paragraph-text--secondary">There are no contacts yet</div>
      )}
    </div>
  )
}

export default ShortContactsList
