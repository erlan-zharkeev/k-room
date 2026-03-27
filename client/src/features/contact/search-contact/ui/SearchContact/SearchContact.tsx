import './style.scss'

import { Virtuoso } from 'react-virtuoso'

import { useSearchContact } from 'src/features/contact/search-contact/hooks'
import { FoundContact } from 'src/features/contact/search-contact/ui/FoundContact/FoundContact'
import { SEARCH_CONTACT_I18N } from 'src/features/contact/search-contact/ui/SearchContact/config'

import { useI18n } from 'src/entities/system'

import { AppDotsAnimatedText, AppInput, AppText } from 'src/shared/ui'

export const SearchContact = () => {
  const { searchQuery, search, searchedContacts, isLoading, isLoadingMore, hasMore, loadMore } = useSearchContact()
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
            <Virtuoso
              data={searchedContacts}
              style={{ height: '320px' }}
              endReached={loadMore}
              computeItemKey={(_, contact) => contact.id}
              itemContent={(_, contact) => <FoundContact {...contact} />}
              components={{
                Footer: () =>
                  isLoadingMore && hasMore ? (
                    <div className="search-contact__footer-loader">
                      <AppDotsAnimatedText text={t(SEARCH_CONTACT_I18N.loadingMore)} />
                    </div>
                  ) : null
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
