import { useDebounceFn } from '@vueuse/core'
import type { IEventGetSearchedContact, IEventSearchContact, IFrontendContact, SocketActionsType } from 'global-shared'
import { onBeforeUnmount, ref, watch } from 'vue'

import { socket } from 'src/shared/api'

import { CONTACTS_PAGE_SEARCH_DEBOUNCE_MS } from '../config/constants'
import type { IUseContactSearchParams } from '../config/types'

export const useContactSearch = ({ searchQuery }: IUseContactSearchParams) => {
  const searchedContacts = ref<IFrontendContact[]>([])
  const searchHasMore = ref(false)
  const searchNextOffset = ref(0)
  const searchValue = ref('')
  const isSearchLoading = ref(false)
  const isSearchLoadingMore = ref(false)

  const resetSearchResults = () => {
    searchedContacts.value = []
    searchHasMore.value = false
    searchNextOffset.value = 0
    isSearchLoading.value = false
    isSearchLoadingMore.value = false
  }

  const fetchContacts = (value: string, offset = 0) => {
    const payload: IEventSearchContact = {
      value,
      offset
    }

    socket.emit<SocketActionsType>('search-contact', payload)
  }

  const debouncedFetchContacts = useDebounceFn(fetchContacts, CONTACTS_PAGE_SEARCH_DEBOUNCE_MS)

  const searchContacts = () => {
    const value = searchQuery.value

    searchValue.value = value

    if (!value) {
      resetSearchResults()
      return
    }

    resetSearchResults()
    isSearchLoading.value = true
    debouncedFetchContacts(value)
  }

  const loadMoreSearchedContacts = () => {
    if (!searchValue.value || !searchHasMore.value || isSearchLoading.value || isSearchLoadingMore.value) return

    isSearchLoadingMore.value = true
    fetchContacts(searchValue.value, searchNextOffset.value)
  }

  const handleSearchedContacts = (payload: IEventGetSearchedContact) => {
    if (payload.value !== searchValue.value) return

    const knownIds = new Set(searchedContacts.value.map(({ id }) => id))
    const nextContacts =
      payload.offset === 0
        ? payload.contacts
        : [...searchedContacts.value, ...payload.contacts.filter(({ id }) => !knownIds.has(id))]

    searchedContacts.value = nextContacts
    searchHasMore.value = payload.hasMore
    searchNextOffset.value = payload.nextOffset ?? 0
    isSearchLoading.value = false
    isSearchLoadingMore.value = false
  }

  socket.on<SocketActionsType>('get-searched-contact', handleSearchedContacts)

  watch(searchQuery, () => searchContacts(), { immediate: true })

  onBeforeUnmount(() => {
    socket.off<SocketActionsType>('get-searched-contact', handleSearchedContacts)
  })

  return {
    searchedContacts,
    searchHasMore,
    isSearchLoading,
    isSearchLoadingMore,
    loadMoreSearchedContacts
  }
}
