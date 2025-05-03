import { ChangeEvent, useState } from 'react'

import { IUserData, SocketActionsType, IEventSearchContact } from 'common-types'

import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { useDebounce } from 'src/shared/lib'

export const useSearchContact = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useUser()
  const [searchedContacts, setSearchedContacts] = useState<IUserData[]>([])

  socket.on<SocketActionsType>('get-searched-contact', (contacts: IUserData[]) => {
    const userFilteredSelf = contacts.filter((user: IUserData) => user.id !== id)
    setSearchedContacts(userFilteredSelf)
    setIsLoading(false)
  })

  const fetchUsers = (value: string) => {
    const searchPayload: IEventSearchContact = { value }
    socket.emit<SocketActionsType>('search-contact', searchPayload)
  }

  const debouncedSearch = useDebounce(fetchUsers, 500)

  const search = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    setSearchQuery(value)
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
