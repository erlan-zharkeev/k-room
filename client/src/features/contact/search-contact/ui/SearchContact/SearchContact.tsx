import './style.scss'

import { useEffect, useRef, useState } from 'react'

import { Virtuoso } from 'react-virtuoso'

import { DROPDOWN_CLOSE_DURATION, SEARCH_CONTACT_I18N, useSearchContact, FoundContact } from 'src/features/contact'

import { useI18n } from 'src/shared/settings'
import { AppClickOutside, AppDotsAnimatedText, AppInput, AppText } from 'src/shared/ui'

export const SearchContact = () => {
  const { searchQuery, search, searchedContacts, isLoading, isLoadingMore, hasMore, loadMore, resetSearch, total } =
    useSearchContact()
  const { t } = useI18n()
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [isDropdownClosing, setIsDropdownClosing] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchedContacts.length > 0) {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }

      setIsDropdownClosing(false)
      setIsDropdownVisible(true)
      return
    }

    if (!isDropdownClosing) {
      setIsDropdownVisible(false)
    }
  }, [searchedContacts.length])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const closeDropdown = () => {
    if (!isDropdownVisible || isDropdownClosing) return

    setIsDropdownClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false)
      setIsDropdownClosing(false)
      resetSearch()
      closeTimeoutRef.current = null
    }, DROPDOWN_CLOSE_DURATION)
  }

  return (
    <AppClickOutside
      active={isDropdownVisible && !isDropdownClosing}
      additionalClassName="search-contact"
      onClickOutside={closeDropdown}
    >
      <AppInput
        showClearButton={Boolean(searchQuery)}
        placeholder={t(SEARCH_CONTACT_I18N.placeholder)}
        onChange={search}
        name="contact"
        value={searchQuery}
        loading={isLoading}
      />
      {isDropdownVisible && (
        <div
          className={`search-contact__dropdown ${
            isDropdownClosing ? 'search-contact__dropdown--closing' : 'search-contact__dropdown--open'
          }`}
        >
          {typeof total === 'number' && (
            <AppText tag="p" align="right" additionalClassName="search-contact__found-el-quantity">
              {t(SEARCH_CONTACT_I18N.found)(total)}
            </AppText>
          )}
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
        </div>
      )}
    </AppClickOutside>
  )
}
