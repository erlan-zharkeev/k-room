import './style.scss'
import { AppForm, AppIcon } from 'src/shared/ui'
import { useSearchContact } from '../../hooks'
import { AppScrollContainer } from 'src/shared/ui/AppScrollContainer/AppScrollContainer'
import { ContactInfo } from 'src/features/contact/contact-info'
import { AddContactBtn } from 'src/features/contact/add-contact'

export const SearchContact = () => {
  const { searchQuery, search, isLoading, searchedContacts } = useSearchContact()

  return (
    <div className="search-contact">
      <AppForm
        onChange={search}
        fields={{
          contact: {
            value: searchQuery,
            placeholder: 'Search contact',
            showClearButton: true,
            prefixSlot: <AppIcon name="search" size="xs" />
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
                <ContactInfo
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
