import './style.scss'

import { AppInput, AppScrollContainer, AppText } from 'src/shared/ui'

import { useSearchContact } from '../../hooks'
import { FoundContact } from '../FoundContact/FoundContact'

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
        <>
          <AppText tag="p" align="right" additionalClassName="search-contact__found-el-quantity">
            Found {searchedContacts.length} contacts
          </AppText>
          <div className="search-contact__list">
            <AppScrollContainer>
              {searchedContacts.map((contact) => (
                <FoundContact key={contact.id} {...contact} />
              ))}
            </AppScrollContainer>
          </div>
        </>
      )}
    </div>
  )
}
