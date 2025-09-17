import './style.scss'

import { useContactList } from 'src/features/contact'

import { AppText, AppScrollContainer } from 'src/shared/ui'

import { ContactListEl } from '../ContactListEl/ContactListEl'

export const ContactList = () => {
  const { contactList } = useContactList()

  return (
    <div className="contact-list">
      {contactList.length <= 0 && <AppText>There are no contacts yet</AppText>}
      <AppScrollContainer height="100%" additionalClassName="contact-list__scroll-controller">
        {contactList.map((contactData) => (
          <div className="contact-list__list-item" key={contactData.id}>
            <ContactListEl contactData={contactData} />
          </div>
        ))}
      </AppScrollContainer>
    </div>
  )
}
