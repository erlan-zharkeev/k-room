import { useDebounceFn } from '@vueuse/core'
import type { IEventGetSearchedContact, IEventSearchContact, IFrontendContact, SocketActionsType } from 'global-shared'
import { isString } from 'lodash'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getRequiredContactSystemData, useContact } from 'src/entities/contact'
import { useSyncMedia } from 'src/entities/media-file'
import { socket } from 'src/shared/api'
import type { DbContactType } from 'src/shared/lib'

import { CONTACTS_PAGE_SEARCH_DEBOUNCE_MS, CONTACTS_PAGE_SEARCH_QUERY_KEY } from '../config/constants'
import { CONTACTS_PAGE_I18N } from '../config/i18n'
import { getContactAvatarId } from '../lib/get-contact-avatar-id'

export const useContactSearchQuery = () => {
  const route = useRoute()
  const router = useRouter()

  const getSearchQuery = () => {
    const value = route.query[CONTACTS_PAGE_SEARCH_QUERY_KEY]

    return isString(value) ? value : ''
  }
  const searchQuery = ref(getSearchQuery())
  const hasSearchQuery = computed(() => Boolean(searchQuery.value))
  const updateSearchRouteQuery = (value: string) => {
    const nextQuery = { ...route.query }

    if (value) {
      nextQuery[CONTACTS_PAGE_SEARCH_QUERY_KEY] = value
    } else {
      delete nextQuery[CONTACTS_PAGE_SEARCH_QUERY_KEY]
    }

    if (getSearchQuery() === value) return

    router.replace({ query: nextQuery })
  }

  watch(
    () => route.query[CONTACTS_PAGE_SEARCH_QUERY_KEY],
    () => {
      const value = getSearchQuery()

      if (searchQuery.value !== value) {
        searchQuery.value = value
      }
    }
  )
  watch(searchQuery, updateSearchRouteQuery)

  return {
    searchQuery,
    hasSearchQuery
  }
}

export const useContactListSearch = () => {
  const { contacts } = useContact()
  const { searchQuery, hasSearchQuery } = useContactSearchQuery()
  const normalizedSearchQuery = computed(() => searchQuery.value.toLowerCase())
  const matchesSearchQuery = ({ nickname }: DbContactType) => {
    const query = normalizedSearchQuery.value

    return !query || nickname.toLowerCase().includes(query)
  }
  const contactList = computed(() =>
    [...contacts.value].filter(matchesSearchQuery).sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))
  )
  const contactListEmptyText = computed(() =>
    hasSearchQuery.value ? CONTACTS_PAGE_I18N.searchEmpty : CONTACTS_PAGE_I18N.listEmpty
  )

  return {
    searchQuery,
    contactList,
    contactListEmptyText
  }
}

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
      const avatarId = getContactAvatarId(id)

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
