import { useDebounceFn } from '@vueuse/core'
import {
  buildAvatarId,
  isDefaultContactInteraction,
  type Contact,
  type EventGetSearchedContact,
  type EventSearchContact,
  type SocketActions
} from 'global-shared'
import unionBy from 'lodash/unionBy'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { mergeContactLocalState, useContact } from 'src/entities/contact'
import { useSyncMedia } from 'src/entities/media-file'
import { socket } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { CONTACTS_PAGE_SEARCH_DEBOUNCE_MS, CONTACTS_SEARCH_BADGE_BY_INTERACTION } from '../config/constants'

import { useContactSearchQuery } from './use-contact-search-query.model'

export const useContactSearch = () => {
  const { searchQuery } = useContactSearchQuery()
  const { mergeMany, isContactExist } = useContact()
  const { sync } = useSyncMedia()
  const { t } = useI18n()
  const syncedAvatarIds = new Set<string>()
  const searchedContacts = ref<Contact[]>([])
  const searchHasMore = ref(false)
  const searchNextOffset = ref(0)
  const searchValue = ref('')
  const isSearchLoading = ref(false)
  const isSearchLoadingMore = ref(false)
  const foundContactList = computed(() => searchedContacts.value.filter(({ id }) => !isContactExist(id)))
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
    const payload: EventSearchContact = {
      value,
      offset
    }

    socket.emit<SocketActions>('search-contact', payload)
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

  const getSearchedContactStatus = ({ interactionType }: Contact) => {
    const badge = CONTACTS_SEARCH_BADGE_BY_INTERACTION[interactionType]

    if (!badge.visible) return ''

    return t(badge.label)
  }

  const getSearchedContactStatusColor = ({ interactionType }: Contact) =>
    CONTACTS_SEARCH_BADGE_BY_INTERACTION[interactionType].color

  const syncSavedContacts = async (contacts: Contact[]) => {
    const savedContacts = contacts.filter(({ interactionType }) => !isDefaultContactInteraction(interactionType))

    await mergeMany(savedContacts, {
      merge: mergeContactLocalState
    })
  }

  const syncContactAvatars = (contacts: Contact[]) => {
    contacts.forEach(({ id }) => {
      const avatarId = buildAvatarId(id)

      if (syncedAvatarIds.has(avatarId)) return

      syncedAvatarIds.add(avatarId)
      sync(avatarId)
    })
  }

  const handleSearchedContacts = async (payload: EventGetSearchedContact) => {
    if (payload.value !== searchValue.value) return

    const nextContacts =
      payload.offset === 0 ? payload.contacts : unionBy(searchedContacts.value, payload.contacts, 'id')

    await syncSavedContacts(nextContacts)
    syncContactAvatars(payload.contacts)

    searchedContacts.value = nextContacts
    searchHasMore.value = payload.hasMore
    searchNextOffset.value = payload.nextOffset ?? 0
    isSearchLoading.value = false
    isSearchLoadingMore.value = false
  }

  socket.on<SocketActions>('get-searched-contact', handleSearchedContacts)

  watch(searchQuery, () => searchContacts(), { immediate: true })

  onBeforeUnmount(() => {
    socket.off<SocketActions>('get-searched-contact', handleSearchedContacts)
  })

  return {
    foundContactList,
    showSearchResults,
    searchHasMore,
    isSearchLoading,
    isSearchLoadingMore,
    getSearchedContactStatus,
    getSearchedContactStatusColor,
    loadMoreSearchedContacts
  }
}
