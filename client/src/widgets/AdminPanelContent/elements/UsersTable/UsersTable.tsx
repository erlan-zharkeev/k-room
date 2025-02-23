import './style.scss'
import { Form, Popconfirm, Table, Typography } from 'antd'
import { AdminEndpoints, IUserSchema, Status } from 'common-types'
import React, { useState } from 'react'
import { Checkbox, Select } from 'antd'
import { Input, Avatar, Icon, Button } from 'src/shared/ui'
import { useApi } from 'src/shared/api'

interface Item
  extends Pick<IUserSchema, '_id' | 'avatarPath' | 'username' | 'email' | 'role' | 'online' | 'confirmed'> {}
interface UserDataToSave extends Pick<IUserSchema, 'id' | 'username' | 'email' | 'role' | 'confirmed'> {}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: string
  inputType: 'checkbox' | 'text' | 'select'
  record: Item
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode

  if (inputType === 'checkbox') {
    inputNode = <Checkbox />
  } else if (inputType === 'select') {
    inputNode = (
      <Select>
        <Select.Option value="user">User</Select.Option>
        <Select.Option value="admin">Admin</Select.Option>
      </Select>
    )
  } else {
    inputNode = <Input />
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          valuePropName={inputType === 'checkbox' ? 'checked' : 'value'}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export const UsersTable: React.FC<{ originData: Item[] }> = ({ originData }) => {
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const [loadingIds, setLoadingIds] = useState<string[]>([])

  const { doRequest } = useApi()
  const isEditing = (record: Item) => record._id === editingKey

  const edit = (record: Partial<Item> & { _id: React.Key }) => {
    form.setFieldsValue(record)
    setEditingKey(record._id)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const updateUserDataHandler = async (userData: UserDataToSave) => {
    try {
      setLoadingIds((prev) => [...prev, userData.id])
      return doRequest('post', AdminEndpoints.UpdateUserData, { userData })
    } catch (e: unknown) {
      console.log('Failed to save updated user data')
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== userData.id))
    }
  }

  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as Item
      const newData = [...data]
      const index = newData.findIndex((item) => key === item._id)
      if (index > -1) {
        const response = await updateUserDataHandler({
          id: key,
          role: row.role,
          username: row.username,
          email: row.email,
          confirmed: row.confirmed
        })
        if (response?.status !== Status.Success) return
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setData(newData)
      } else {
        newData.push(row)
        setData(newData)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    } finally {
      setEditingKey('')
    }
  }

  const deleteUser = async (id: string) => {
    setLoadingIds((prev) => [...prev, id])
    try {
      const response = await doRequest('post', AdminEndpoints.DeleteUser, { deleteUserId: id })
      if (response && response.status === 200) {
        setData(data.filter((user) => user._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id))
    }
  }

  const columns = [
    {
      title: '',
      dataIndex: 'avatarPath',
      render: (_: unknown, record: Item) => (
        <div className="avatar-path-column">
          <Avatar src={record.avatarPath} online={record.online} />
        </div>
      )
    },
    {
      title: 'id',
      dataIndex: '_id',
      editable: false
    },
    {
      title: 'Username',
      dataIndex: 'username',
      editable: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true
    },
    {
      title: 'Role',
      dataIndex: 'role',
      editable: true,
      render: (_: unknown, record: Item) => record.role
    },
    {
      title: 'Confirmed',
      dataIndex: 'confirmed',
      editable: true,
      render: (_: unknown, record: Item) => <Checkbox checked={Boolean(record.confirmed)} disabled />
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: unknown, record: Item) => {
        const editable = isEditing(record)
        const isLoading = loadingIds.includes(record._id)

        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record._id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="users-table__operations-wrapper">
            {isLoading ? (
              <div className="users-table__operations">
                <Icon name="loader" color="accent" size="small" />
              </div>
            ) : (
              <div className="users-table__operations">
                <Button text="Edit" disabled={editingKey !== ''} onClick={() => edit(record)} color="accent" />
                <Popconfirm title="Sure to delete user?" onConfirm={() => deleteUser(record._id)}>
                  <Button iconName="trash" color="error" disabled={editingKey !== ''} />
                </Popconfirm>
              </div>
            )}
          </div>
        )
      }
    }
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'confirmed' ? 'checkbox' : col.dataIndex === 'role' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <Form form={form} component={false}>
      <Table
        className="users-table"
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={data.map((item) => ({ ...item, key: item._id }))}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel
        }}
      />
    </Form>
  )
}
