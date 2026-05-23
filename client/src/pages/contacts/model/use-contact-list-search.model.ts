import orderBy from 'lodash/orderBy'
import { computed } from 'vue'

import { useContact } from 'src/entities/contact'
import type { ContactRecord } from 'src/shared/lib'

import { CONTACTS_PAGE_I18N } from '../config/i18n'

import { useContactSearchQuery } from './use-contact-search-query.model'

export const useContactListSearch = () => {
  const { contacts } = useContact()
  const { searchQuery, hasSearchQuery } = useContactSearchQuery()
  const normalizedSearchQuery = computed(() => searchQuery.value.toLowerCase())
  const matchesSearchQuery = ({ nickname }: ContactRecord) => {
    const query = normalizedSearchQuery.value

    return !query || nickname.toLowerCase().includes(query)
  }
  const contactList = computed(() => orderBy(contacts.value.filter(matchesSearchQuery), 'savedAt', 'desc'))
  const contactListEmptyText = computed(() =>
    hasSearchQuery.value ? CONTACTS_PAGE_I18N.searchEmpty : CONTACTS_PAGE_I18N.listEmpty
  )

  return {
    searchQuery,
    contactList,
    contactListEmptyText
  }
}
