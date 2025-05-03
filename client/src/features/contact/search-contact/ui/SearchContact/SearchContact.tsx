import './style.scss'
import { AddContactBtn } from 'src/features/contact/add-contact'
import { ProfileInfo } from 'src/features/profile-info'

import { AppForm } from 'src/shared/ui'
import { AppScrollContainer } from 'src/shared/ui/AppScrollContainer/AppScrollContainer'

import { useSearchContact } from '../../hooks'

export const SearchContact = () => {
  const { searchQuery, search, isLoading, searchedContacts } = useSearchContact()

  return (
    <div className="search-contact">
      <AppForm
        onChange={search}
        fields={{
          contact: {
            value: searchQuery,
            placeholder: '🔍 Search contact',
            showClearButton: true
          }
        }}
        submitBtnText="Search"
        submitBtnLoading={isLoading}
        showSubmitBtn={false}
      />
      <AppScrollContainer>
        {searchedContacts.length > 0 && (
          <div className="search-contact__list">
            {searchedContacts.map((contact) => (
              <div className="search-contact__list-element">
                <ProfileInfo
                  avatarPath={contact.avatarPath}
                  username={contact.username}
                  email={contact.email}
                  showBadge={false}
                />
                <AddContactBtn id={contact.id} searchedContacts={searchedContacts} />
              </div>
            ))}
          </div>
        )}
      </AppScrollContainer>
    </div>
  )
}
