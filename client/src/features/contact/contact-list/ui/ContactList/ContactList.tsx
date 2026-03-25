import './style.scss'

import { useContactList } from 'src/features/contact'

import { useI18n } from 'src/entities/system'

import { AppText, AppScrollContainer } from 'src/shared/ui'

import { ContactListEl } from '../ContactListEl/ContactListEl'

import { CONTACT_LIST_I18N } from './config'

export const ContactList = () => {
  const { contactList } = useContactList()
  const { t } = useI18n()

  return (
    <div className="contact-list">
      {contactList.length <= 0 && <AppText>{t(CONTACT_LIST_I18N.empty)}</AppText>}
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
