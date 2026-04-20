import './style.scss'

import { CONTACTS_WIDGET_I18N } from 'src/widgets/aside-panel'

import { ContactList } from 'src/features/contact-list'
import { SearchContact } from 'src/features/search-contact'

import { useI18n } from 'src/shared/preferences'
import { AppHeader } from 'src/shared/ui'

export const Contacts = () => {
  const { t } = useI18n()

  return (
    <div className="contacts">
      <SearchContact />
      <div className="divider" />
      <AppHeader tag="h4">{t(CONTACTS_WIDGET_I18N.title)}</AppHeader>
      <ContactList />
    </div>
  )
}
