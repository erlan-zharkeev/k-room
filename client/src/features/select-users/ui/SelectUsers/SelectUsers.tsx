import './style.scss'
import { useState, useEffect } from 'react'

import { Tag } from 'antd'
import { UserShortType } from 'common-types'

import { useTypedSelector } from 'src/shared/lib'
import { AppAvatar } from 'src/shared/ui'

type UsersToSelect = UserShortType[]

export const SelectUsers = ({ setMembers }: { setMembers: React.Dispatch<React.SetStateAction<UsersToSelect>> }) => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const [contactsToSelect, setContactsToSelect] = useState<UsersToSelect>(contacts)
  const [selectedUsers, updateSelectedUsers] = useState<UsersToSelect>([])

  useEffect(() => {
    setMembers(selectedUsers)
  }, [selectedUsers, setMembers])

  useEffect(() => {
    const updatedContacts = contacts
      .map((contact) => ({
        id: contact.id,
        username: contact.username,
        avatarPath: contact.avatarPath
      }))
      .filter((contact) => !selectedUsers.some((selected) => selected.id === contact.id)) // Исключаем уже выбранных пользователей

    setContactsToSelect(updatedContacts)
  }, [contacts, selectedUsers])

  const onClickHandler = (clickedContact: UserShortType) => {
    updateSelectedUsers((prevSelected) => {
      const isUserExist = prevSelected.some((contact) => contact.id === clickedContact.id)
      const updatedSelected = isUserExist
        ? prevSelected.filter((contact) => contact.id !== clickedContact.id)
        : [...prevSelected, clickedContact]

      return updatedSelected
    })
  }

  const handleClose = (id: string) => {
    updateSelectedUsers((prevSelected) => {
      const updatedSelected = prevSelected.filter((contact) => contact.id !== id)
      return updatedSelected
    })
  }

  return (
    <div className="select-users">
      {contactsToSelect.length > 0 && <div className="select-users__title">Available contacts:</div>}
      <div className="select-users__choose-list">
        {contactsToSelect.map((contact) => (
          <div className="select-users__user" key={contact.id} onClick={() => onClickHandler(contact)}>
            <AppAvatar shape="square-shape" src={contact.avatarPath} />
            <span className="paragraph-text  select-users__name">{contact.username}</span>
          </div>
        ))}
      </div>
      {contactsToSelect.length > 0 && selectedUsers.length > 0 && <div className="select-users__divider" />}
      {selectedUsers.length > 0 && <div className="select-users__title">Selected contacts:</div>}
      <div className="select-users__selected-users">
        {selectedUsers.map((selectedUser) => (
          <div className="select-users__selected-user" key={selectedUser.id}>
            <Tag
              closable
              onClose={(e) => {
                e.preventDefault()
                handleClose(selectedUser.id)
              }}
            >
              {selectedUser.username}
            </Tag>
          </div>
        ))}
      </div>
    </div>
  )
}
