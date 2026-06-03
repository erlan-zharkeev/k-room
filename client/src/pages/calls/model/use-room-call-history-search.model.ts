import { useDebounceFn } from '@vueuse/core'
import { ROOM_CALL_LOAD_LIMIT_MAX, type EventLoadRoomCalls, type RoomCall } from 'global-shared'
import { computed, ref, watch } from 'vue'

import { useRoomCall } from 'src/entities/room-call'
import { useSocketAction } from 'src/shared/api'

import { ROOM_CALL_HISTORY_SEARCH_DEBOUNCE_MS } from '../config/constants'

const searchQuery = ref('')

export const useRoomCallHistorySearch = () => {
  const { bulkPut } = useRoomCall()
  const { emitSocketAction } = useSocketAction()
  const searchedRoomCalls = ref<RoomCall[]>([])
  const searchHasMore = ref(false)
  const searchNextBeforeCalledAt = ref<number | null>(null)
  const searchValue = ref('')
  const isSearchLoading = ref(false)
  const isSearchLoadingMore = ref(false)

  const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const resetSearchResults = () => {
    searchedRoomCalls.value = []
    searchHasMore.value = false
    searchNextBeforeCalledAt.value = null
    isSearchLoading.value = false
    isSearchLoadingMore.value = false
  }

  const loadSearchedRoomCalls = async (query: string, beforeCalledAt?: number) => {
    const payload: EventLoadRoomCalls = {
      query,
      limit: ROOM_CALL_LOAD_LIMIT_MAX,
      ...(beforeCalledAt && { beforeCalledAt })
    }
    const response = await emitSocketAction('load-room-calls', payload)

    if (query !== searchValue.value) return

    if (response.ok) {
      const nextRoomCalls = beforeCalledAt
        ? [...searchedRoomCalls.value, ...response.payload.roomCalls]
        : response.payload.roomCalls

      await bulkPut(response.payload.roomCalls)

      searchedRoomCalls.value = nextRoomCalls
      searchHasMore.value = response.payload.hasMore
      searchNextBeforeCalledAt.value = response.payload.nextBeforeCalledAt
    }

    isSearchLoading.value = false
    isSearchLoadingMore.value = false
  }

  const debouncedLoadSearchedRoomCalls = useDebounceFn(loadSearchedRoomCalls, ROOM_CALL_HISTORY_SEARCH_DEBOUNCE_MS)

  const searchRoomCalls = () => {
    const query = searchQuery.value.trim()

    searchValue.value = query

    if (!query) {
      resetSearchResults()
      return
    }

    resetSearchResults()
    isSearchLoading.value = true
    debouncedLoadSearchedRoomCalls(query)
  }

  const loadMoreSearchedRoomCalls = () => {
    const canLoadMoreSearchResults = Boolean(searchValue.value && searchHasMore.value && searchNextBeforeCalledAt.value)
    const isAlreadyLoading = isSearchLoading.value || isSearchLoadingMore.value

    if (!canLoadMoreSearchResults || isAlreadyLoading) return

    isSearchLoadingMore.value = true
    void loadSearchedRoomCalls(searchValue.value, searchNextBeforeCalledAt.value ?? undefined)
  }

  watch(searchQuery, searchRoomCalls, { immediate: true })

  return {
    searchQuery,
    normalizedSearchQuery,
    searchedRoomCalls,
    searchHasMore,
    isSearchLoading,
    isSearchLoadingMore,
    loadMoreSearchedRoomCalls
  }
}
