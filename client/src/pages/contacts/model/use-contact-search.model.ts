import { useDebounceFn } from '@vueuse/core'
import type { IEventGetSearchedContact, IEventSearchContact, IFrontendContact, SocketActionsType } from 'global-shared'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { getRequiredContactSystemData, useContact } from 'src/entities/contact'
import { useSyncMedia } from 'src/entities/media-file'
import { socket } from 'src/shared/api'
import { getAvatarId } from 'src/shared/lib'

import { CONTACTS_PAGE_SEARCH_DEBOUNCE_MS } from '../config/constants'

import { useContactSearchQuery } from './use-contact-search-query.model'

export const useContactSearch = () => {
  const { searchQuery } = useContactSearchQuery()
  const { mergeMany, isExist } = useContact()
  const { sync } = useSyncMedia()
  const syncedAvatarIds = new Set<string>()
  const searchedContacts = ref<IFrontendContact[]>([])
  const searchHasMore = ref(false)
  const searchNextOffset = ref(0)
  const searchValue = ref('')
  const isSearchLoading = ref(false)
  const isSearchLoadingMore = ref(false)
  const foundContactList = computed(() => searchedContacts.value.filter(({ id }) => !isExist(id)))
  const showSearchResults = computed(
    () => Boolean(searchQuery.value) && (isSearchLoading.value || Boolean(foundContactList.value.length))
  )

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

  const syncSavedContacts = async (contacts: IFrontendContact[]) => {
    const savedContacts = contacts.filter(({ interactionType }) => interactionType !== 'default')

    await mergeMany(savedContacts, {
      merge: (current, incoming) => ({
        ...getRequiredContactSystemData(),
        ...current,
        ...incoming,
        savedAt: current?.savedAt ?? Date.now(),
        onlineStatusSyncedAt: Date.now()
      })
    })
  }

  const syncContactAvatars = (contacts: IFrontendContact[]) => {
    contacts.forEach(({ id }) => {
      const avatarId = getAvatarId(id)

      if (syncedAvatarIds.has(avatarId)) return

      syncedAvatarIds.add(avatarId)
      sync(avatarId)
    })
  }

  const handleSearchedContacts = async (payload: IEventGetSearchedContact) => {
    if (payload.value !== searchValue.value) return

    const knownIds = new Set(searchedContacts.value.map(({ id }) => id))
    const nextContacts =
      payload.offset === 0
        ? payload.contacts
        : [...searchedContacts.value, ...payload.contacts.filter(({ id }) => !knownIds.has(id))]

    await syncSavedContacts(nextContacts)
    syncContactAvatars(payload.contacts)

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
    foundContactList,
    showSearchResults,
    searchHasMore,
    isSearchLoading,
    isSearchLoadingMore,
    loadMoreSearchedContacts
  }
}
