import './style.scss'

import { useSearchContact } from 'src/features/contact/search-contact/hooks'
import { FoundContact } from 'src/features/contact/search-contact/ui/FoundContact/FoundContact'
import { SEARCH_CONTACT_I18N } from 'src/features/contact/search-contact/ui/SearchContact/config'

import { useI18n } from 'src/entities/system'

import { AppInput, AppScrollContainer, AppText } from 'src/shared/ui'

export const SearchContact = () => {
  const { searchQuery, search, searchedContacts, isLoading } = useSearchContact()
  const { t } = useI18n()

  return (
    <div className="search-contact">
      <AppInput
        showClearButton={Boolean(searchQuery)}
        placeholder={t(SEARCH_CONTACT_I18N.placeholder)}
        onChange={search}
        name="contact"
        value={searchQuery}
        loading={isLoading}
      />
      {searchedContacts.length > 0 && (
        <>
          <AppText tag="p" align="right" additionalClassName="search-contact__found-el-quantity">
            {t(SEARCH_CONTACT_I18N.found)(searchedContacts.length)}
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
