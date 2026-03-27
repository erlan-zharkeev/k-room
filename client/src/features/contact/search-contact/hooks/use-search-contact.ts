import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { IEventGetSearchedContact, IEventSearchContact, IFrontendContact, SocketActionsType, VALIDATION_LIMITS } from 'common'

import { socket } from 'src/shared/api'
import { useDebounce } from 'src/shared/lib'

// import { SEARCHED_CONTACTS_MOCK } from 'src/features/contact/search-contact/config/constants'

export const useSearchContact = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [nextOffset, setNextOffset] = useState(0)
  const [searchedContacts, setSearchedContacts] = useState<IFrontendContact[]>([])
  const currentQueryRef = useRef('')

  useEffect(() => {
    const handleSearchedContacts = ({ value, offset, contacts, hasMore, nextOffset }: IEventGetSearchedContact) => {
      if (value !== currentQueryRef.current) return

      setSearchedContacts((prev) => {
        if (offset === 0) return contacts

        const knownIds = new Set(prev.map((contact) => contact.id))
        return [...prev, ...contacts.filter((contact) => !knownIds.has(contact.id))]
      })
      setHasMore(hasMore)
      setNextOffset(nextOffset ?? 0)
      setIsLoading(false)
      setIsLoadingMore(false)
    }

    socket.on<SocketActionsType>('get-searched-contact', handleSearchedContacts)

    return () => {
      socket.off<SocketActionsType>('get-searched-contact', handleSearchedContacts)
    }
  }, [])

  const fetchUsers = ({ value, offset = 0 }: { value: string; offset?: number }) => {
    const searchPayload: IEventSearchContact = {
      value,
      offset,
      limit: VALIDATION_LIMITS.searchContactResultLimit
    }
    socket.emit<SocketActionsType>('search-contact', searchPayload)
  }

  const debouncedSearch = useDebounce(fetchUsers, 500)

  const search = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    const normalizedValue = value.trim()

    setSearchQuery(value)

    currentQueryRef.current = normalizedValue

    if (normalizedValue === '') {
      setSearchedContacts([])
      setHasMore(false)
      setNextOffset(0)
      setIsLoading(false)
      setIsLoadingMore(false)
      return
    }

    setIsLoading(true)
    setSearchedContacts([])
    setHasMore(false)
    setNextOffset(0)
    debouncedSearch({ value, offset: 0 })
  }

  const loadMore = () => {
    if (!currentQueryRef.current || !hasMore || isLoading || isLoadingMore) return

    setIsLoadingMore(true)
    fetchUsers({ value: currentQueryRef.current, offset: nextOffset })
  }

  return {
    searchQuery,
    search,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    searchedContacts
  }
}
