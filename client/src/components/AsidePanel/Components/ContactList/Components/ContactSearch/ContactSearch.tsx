import { List } from 'antd'
import { useEffect, useState } from 'react'
import { User, SocketActions } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import useDebounce from 'src/hooks/useDebounce'
import UIInput from 'ui/UIInput'
import UIIcon from 'ui/UIIcon'
import UIAvatar from 'ui/UIAvatar'
import UIButton from 'ui/UIButton'

const ContactSearch = () => {
  const [users, setUsers] = useState([] as Array<User>)
  const [isLoading, setIsLoading] = useState(false)

  const { id } = useTypedSelector((state) => state.user.userData)
  const { contacts } = useTypedSelector((state) => state.contacts)

  useEffect(() => {
    socket.on(SocketActions.GET_SEARCHED_CONTACTS, (contacts: Array<User>) => {
      const userFilteredSelf = contacts.filter((user: User) => user.id !== id)
      setUsers(userFilteredSelf)
      setIsLoading(false)
    })
  }, [])

  const fetchUsers = async (value: string) => {
    socket.emit(SocketActions.SEARCH_CONTACT, { value })
  }

  const debouncedSearch = useDebounce(fetchUsers, 500)

  const search = async (value: string) => {
    if (value.trim() === '') {
      setUsers([])
      return
    }
    setIsLoading(true)
    await debouncedSearch(value)
  }

  const addUser = async (interlocutorId: string | undefined) => {
    if (!interlocutorId) return
    const interlocutorData = users.find((user) => user.id === interlocutorId)
    if (!interlocutorData) return
    socket.emit(SocketActions.SAVE_CONTACT, { userId: id, interlocutorId: interlocutorData.id })
  }

  return (
    <div className="contact-search">
      <UIInput
        size="small"
        placeholder="Search user"
        suffix={<UIIcon name={isLoading ? 'loader' : 'search'} color={isLoading ? 'accent' : 'default'} />}
        onChange={async (e) => await search(e.target.value)}
      />
      {users.length > 0 && (
        <div className="contact-search__global-search">
          <List
            header={<div>Global search</div>}
            itemLayout="horizontal"
            dataSource={users}
            renderItem={(user) => (
              <List.Item key={user.id}>
                <List.Item.Meta
                  avatar={<UIAvatar src={user.avatar} />}
                  title={<span>{user.username}</span>}
                  description={<span>{user.email}</span>}
                />
                {!contacts.find((element) => element.id === user.id) && (
                  <UIButton
                    iconName="plus"
                    color="accent"
                    onClick={async () => await addUser(user.id)}
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

export default ContactSearch
