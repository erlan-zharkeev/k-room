import { SelectProps, Select } from 'antd'
import { UserShort } from 'common-types'
import { useEffect, useState } from 'react'
import useTypedSelector from 'src/hooks/useTypedSelector'

const MultipleUserSelect = ({ setMembers }: { setMembers: React.Dispatch<React.SetStateAction<Array<UserShort>>> }) => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const [users, setUsers] = useState([] as SelectProps['options'])

  useEffect(() => {
    const transformedContacts = contacts.map((contact) => {
      return { value: contact.id, label: contact.username }
    })
    setUsers(transformedContacts)
  }, [])

  const handleChange = (ids: string[]) => {
    const members = ids?.map((id) => {
      return {
        id,
        username: contacts.find((contact) => contact.id === id)?.username ?? ''
      }
    })
    setMembers(members)
  }
  return (
    <div className="multiple-user-select">
      <Select
        mode="multiple"
        placeholder="Select members"
        onChange={handleChange}
        style={{ width: '100%' }}
        options={users}
      />
    </div>
  )
}

export default MultipleUserSelect
