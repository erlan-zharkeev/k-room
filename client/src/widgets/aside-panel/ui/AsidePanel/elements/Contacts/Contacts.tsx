import './style.scss'

import { ContactList, SearchContact } from 'src/features/contact'

import { AppHeader } from 'src/shared/ui'

export const Contacts = () => {
  return (
    <div className="contacts">
      <SearchContact />
      <div className="divider" />
      <AppHeader tag="h4">Contacts</AppHeader>
      <ContactList />
    </div>
  )
}
