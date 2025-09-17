import { ChangeEvent, useEffect, useState } from 'react'

import { SocketActionsType, IEventSearchContact, FrontendContactType } from 'common-types'

import { socket } from 'src/shared/api'
import { useDebounce } from 'src/shared/lib'

// import { SEARCHED_CONTACTS_MOCK } from '../config/constants'

export const useSearchContact = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchedContacts, setSearchedContacts] = useState<FrontendContactType[]>([])

  useEffect(() => {
    socket.on<SocketActionsType>('get-searched-contact', (contacts: FrontendContactType[]) => {
      setSearchedContacts(contacts)
      setIsLoading(false)
    })
  }, [])

  const fetchUsers = (value: string) => {
    const searchPayload: IEventSearchContact = { value }
    socket.emit<SocketActionsType>('search-contact', searchPayload)
  }

  const debouncedSearch = useDebounce(fetchUsers, 500)

  const search = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setSearchQuery(value)
    if (value === '') {
      setSearchedContacts([])
      return
    }
    setIsLoading(true)
    debouncedSearch(value)
  }

  return {
    searchQuery,
    search,
    isLoading,
    searchedContacts
  }
}
