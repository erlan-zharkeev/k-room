import { List } from 'antd'
import { SocketActions, KRoomUser, SocketActionsPayload } from 'common-types'
import { useState } from 'react'
import { UIInput, UIIcon, UIAvatar, UIButton } from 'src/components'
import { useTypedSelector, useDebounce } from 'src/hooks'
import { $socket } from 'src/services'

export const ContactSearch = () => {
  const [users, setUsers] = useState([] as Array<KRoomUser>)
  const [isLoading, setIsLoading] = useState(false)

  const { id } = useTypedSelector((state) => state.user.userData)
  const { contacts } = useTypedSelector((state) => state.contacts)

  $socket.on(SocketActions.GET_SEARCHED_CONTACT, (contacts: Array<KRoomUser>) => {
    const userFilteredSelf = contacts.filter((user: KRoomUser) => user.id !== id)
    setUsers(userFilteredSelf)
    setIsLoading(false)
  })

  const fetchUsers = (value: string) => {
    const searchPayload: SocketActionsPayload['searchContact'] = { value }
    $socket.emit(SocketActions.SEARCH_CONTACT, searchPayload)
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
    $socket.emit(SocketActions.SAVE_CONTACT, { userId: id, interlocutorId: interlocutorData.id })
  }

  return (
    <div className="contact-search">
      <UIInput
        size="small"
        placeholder="Search user"
        suffix={<UIIcon name={isLoading ? 'loader' : 'search'} color={isLoading ? 'accent' : 'default'} />}
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
                  avatar={<UIAvatar src={user.avatarPath} showBadge={false} />}
                  title={<span>{user.username}</span>}
                  description={<span>{user.email}</span>}
                />
                {!contacts.find((element) => element.id === user.id) && (
                  <UIButton
                    iconName="plus"
                    color="accent"
                    onClick={() => addUser(user.id)}
                    tooltip="Add User"
                  />
                )}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}
