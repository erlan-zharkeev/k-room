import { Avatar, Button, Input, List, Radio, Tooltip } from 'antd'
import { SearchOutlined, LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import _debounce from 'lodash/debounce'
import { User, SocketActions } from 'common-types'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'

const ContactSearch = () => {
  const [users, setUsers] = useState([] as Array<User>)
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, changeSearchType] = useState('name')

  const { id } = useTypedSelector((state) => state.auth.userData)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { settings } = useTypedSelector((state) => state.persist.system)

  useEffect(() => {
    socket.on(SocketActions.GET_SEARCHED_CONTACTS, (contacts: Array<User>) => {
      const userFilteredSelf = contacts.filter((user: User) => user.id !== id)
      setUsers(userFilteredSelf)
      setIsLoading(false)
    })
  }, [])

  const fetchUsers = async (type: string, value: string) => {
    const searchData = { type, value }
    socket.emit(SocketActions.SEARCH_CONTACT, searchData)
  }

  const debouncedSearch = useCallback(_debounce(fetchUsers, 500), [])

  const search = async (value: string) => {
    if (value.trim() === '') {
      setUsers([])
      return
    }
    setIsLoading(true)
    await debouncedSearch(searchType, value)
  }

  const addUser = async (interlocutorId: string | undefined) => {
    if (!interlocutorId) return
    const interlocutorData = users.find((user) => user.id === interlocutorId)
    socket.emit(SocketActions.SAVE_CONTACT, { userId: id, interlocutorId: interlocutorData.id })
  }

  const searchTypes = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Id', value: 'id', checked: true }
  ]

  const ButtonWrapper = (user: User) => {
    return settings.showTooltips ? (
      <Tooltip placement="topLeft" title="Add contact">
        <Button size="small" icon={<PlusOutlined />} onClick={async () => await addUser(user.id)} />
      </Tooltip>
    ) : (
      <Button size="small" icon={<PlusOutlined />} onClick={async () => await addUser(user.id)} />
    )
  }

  return (
    <div className="contact-search">
      <div className="contact-search__search-type">
        <Radio.Group
          className="contact-search__search-type-element"
          options={searchTypes}
          onChange={(e) => changeSearchType(e.target.value)}
          value={searchType}
          optionType="button"
          buttonStyle="outline"
          size="small"
        />
      </div>
      <Input
        placeholder={`Search user by ${searchType}`}
        suffix={isLoading ? <LoadingOutlined /> : <SearchOutlined />}
        onChange={async (e: ChangeEvent<HTMLInputElement>) => await search(e.target.value)}
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
                  avatar={<Avatar src={user.avatar} icon={<UserOutlined />} />}
                  title={<span>{user.username}</span>}
                  description={<span>{user.email}</span>}
                />
                {!contacts.find((element: any) => element.id === user.id) && ButtonWrapper(user)}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}

export default ContactSearch
