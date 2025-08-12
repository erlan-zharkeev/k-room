import './style.scss'

import { AddContactBtn } from 'src/features/contact/add-contact'
import { ProfileInfo } from 'src/entities/profile-info'

import { AppInput, AppScrollContainer } from 'src/shared/ui'

import { useSearchContact } from '../../hooks'

export const SearchContact = () => {
  const { searchQuery, search, searchedContacts, isLoading } = useSearchContact()

  return (
    <div className="search-contact">
      <AppInput
        showClearButton={Boolean(searchQuery)}
        placeholder="Search contact"
        onChange={search}
        name="contact"
        value={searchQuery}
        loading={isLoading}
      />
      {searchedContacts.length > 0 && (
        <div className="search-contact__list">
          <AppScrollContainer>
            {searchedContacts.map((contact) => (
              <div className="search-contact__list-element" key={contact.id}>
                <ProfileInfo
                  avatar={contact.avatar}
                  title={contact.username}
                  description={contact.email}
                  showBadge={false}
                />
                <AddContactBtn id={contact.id} searchedContacts={searchedContacts} />
              </div>
            ))}
          </AppScrollContainer>
        </div>
      )}
    </div>
  )
}
