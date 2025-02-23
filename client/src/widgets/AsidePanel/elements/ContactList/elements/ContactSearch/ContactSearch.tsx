import './style.scss'
import { List } from 'antd'
import { SocketActions, KRoomUser, EventSearchContact } from 'common-types'
import { useState } from 'react'
import { socket } from 'src/shared/api'
import { useDebounce, useTypedSelector } from 'src/shared/lib'
import { Input, Icon, Avatar, Button } from 'src/shared/ui'

export const ContactSearch = () => {
  const [users, setUsers] = useState([] as Array<KRoomUser>)
  const [isLoading, setIsLoading] = useState(false)

  const { id } = useTypedSelector((state) => state.user.userData)
  const { contacts } = useTypedSelector((state) => state.contacts)

  socket.on<SocketActions>('get-searched-contact', (contacts: Array<KRoomUser>) => {
    const userFilteredSelf = contacts.filter((user: KRoomUser) => user.id !== id)
    setUsers(userFilteredSelf)
    setIsLoading(false)
  })

  const fetchUsers = (value: string) => {
    const searchPayload: EventSearchContact = { value }
    socket.emit<SocketActions>('search-contact', searchPayload)
  }

  const debouncedSearch = useDebounce(fetchUsers, 500)

  const search = (value: string) => {
    setIsLoading(true)
    debouncedSearch(value)
  }

  const addUser = async (interlocutorId: string | undefined) => {
    if (!interlocutorId) return
    const interlocutorData = users.find((user) => user.id === interlocutorId)
    if (!interlocutorData) return
    socket.emit<SocketActions>('save-contact', { userId: id, interlocutorId: interlocutorData.id })
  }

  return (
    <div className="contact-search">
      <Input
        size="small"
        placeholder="Search user"
        suffix={<Icon name={isLoading ? 'loader' : 'search'} color={isLoading ? 'accent' : 'default'} />}
        onChange={(e: { target: { value: string } }) => search(e.target.value)}
      />
      {users.length > 0 && (
        <div className="contact-search__global-search">
          <List
            header={<div className="contact-search__global-search-header">Global search</div>}
            itemLayout="horizontal"
            dataSource={users}
            renderItem={(user) => (
              <List.Item key={user.id}>
                <List.Item.Meta
                  avatar={<Avatar src={user.avatarPath} showBadge={false} />}
                  title={<span>{user.username}</span>}
                  description={<span>{user.email}</span>}
                />
                {!contacts.find((element) => element.id === user.id) && (
                  <Button iconName="plus" color="accent" onClick={() => addUser(user.id)} tooltip="Add User" />
                )}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}
