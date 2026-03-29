import './style.scss'

import { useI18n } from 'src/entities/system'

import { useAnimatedList } from 'src/shared/lib'
import { AppScrollContainer, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { CONTACT_LIST_I18N, ContactListEl, useContactList } from '../..'

export const ContactList = () => {
  const { contactList } = useContactList()
  const { t } = useI18n()
  const { renderedItems } = useAnimatedList(contactList ?? [], 'id')

  return (
    <div className="contact-list">
      {contactList.length <= 0 && <AppText>{t(CONTACT_LIST_I18N.empty)}</AppText>}
      <AppScrollContainer height="100%" additionalClassName="contact-list__scroll-controller">
        <div className="contact-list__items animated-list">
          {renderedItems.map(({ item, key, state }) => (
            <div
              className={createClassNameWithModifiers({
                rootClass: 'contact-list__list-item animated-list__item',
                modifiers: [state],
                additionalClassName: `animated-list__item--${state}`
              })}
              key={key}
            >
              <ContactListEl contactData={item} />
            </div>
          ))}
        </div>
      </AppScrollContainer>
    </div>
  )
}
