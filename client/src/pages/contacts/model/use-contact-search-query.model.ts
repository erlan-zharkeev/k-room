import { isString } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CONTACTS_PAGE_SEARCH_QUERY_KEY } from '../config/constants'

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
