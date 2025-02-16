import { useApi } from 'src/services'
import { WidgetWrapper } from '../shared'
import { useEffect, useState } from 'react'
import {
  AdminEndpoints,
  AdminPanelModelTab,
  IDBCallSchema,
  IDBChatRoomSchema,
  IMessageSchema,
  IUserSchema,
  Status
} from 'common-types'
import { useTypedSelector, useUpdateSettings } from 'src/hooks'
import { UIButton } from '../ui'
import { useDispatch } from 'react-redux'
import { showModal } from 'src/store'
import { UsersTable } from './elements'

interface IGetAppDataPayload {
  users: IUserSchema[]
  calls: IDBCallSchema[]
  chatRooms: IDBChatRoomSchema[]
  messages: IMessageSchema[]
}

const dbElements = [
  { value: 'users', name: 'users', component: UsersTable },
  { value: 'calls', name: 'calls' },
  { value: 'chatRooms', name: 'chat-rooms' },
  { value: 'messages', name: 'messages' }
]

export const AdminPanelContent = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const { updateSetting } = useUpdateSettings()
  const { doRequest } = useApi()
  const [data, setData] = useState<IGetAppDataPayload | null>(null)
  const [error, setError] = useState(false)
  const { selectedAdminPanelModelTab } = useTypedSelector((state) => state.persist.settings)

  const getData = async () => {
    setLoading(true)
    const response = await doRequest('get', AdminEndpoints.GetAppData)
    setLoading(false)
    if (response && response.status) {
      if (response.status === Status.Success && response.data) {
        const data = response.data as IGetAppDataPayload
        setData(data)
      }
    }
    setError(!response || response.status !== Status.Success)
  }

  useEffect(() => {
    getData()
  }, [])

  const [dbClearLoader, setDbClearLoader] = useState(false)
  const dbClearLoaderHandler = () => {
    dispatch(
      showModal({
        title: 'Confirmation',
        textContent: 'Are you shure want to clear data base?',
        confirmBtn: {
          text: 'Clear',
          loader: dbClearLoader,
          callback: async () => {
            setDbClearLoader(true)
            await doRequest('post', AdminEndpoints.DBClear)
            await getData()
            setDbClearLoader(false)
          }
        }
      })
    )
  }

  const [dBApplyFixturesLoader, setdBApplyFixturesLoader] = useState(false)
  const applyBasicFixtures = () => {
    dispatch(
      showModal({
        title: 'Confirmation',
        textContent: 'Are you shure want to apply basic fixtures?',
        confirmBtn: {
          text: 'Apply',
          loader: dBApplyFixturesLoader,
          callback: async () => {
            setdBApplyFixturesLoader(true)
            await doRequest('patch', AdminEndpoints.ApplyFixtures)
            await getData()
            setdBApplyFixturesLoader(false)
          }
        }
      })
    )
  }

  return (
    <div className="admin-panel-content">
      <WidgetWrapper loading={loading}>
        {error ? (
          <p>Failed to get data</p>
        ) : (
          <div className="admin-panel-content__data">
            <div className="admin-panel-content__header">
              <h1 className="header-text header-text--secondary header-text--lg">Admin panel</h1>
              <div className="admin-panel-content__actions">
                <UIButton
                  text="Refresh"
                  border="common-border"
                  className="refresh-btn admin-panel-content__btn"
                  onClick={getData}
                />
                <UIButton
                  text="DB Сlear"
                  border="common-border"
                  className="db-reset-btn admin-panel-content__btn"
                  onClick={dbClearLoaderHandler}
                />
                <UIButton
                  text="Apply basic fixtures"
                  border="common-border"
                  className="apply-base-fixtures-btn admin-panel-content__btn"
                  onClick={applyBasicFixtures}
                />
              </div>
            </div>
            <div className="admin-panel-content__header-elements">
              {dbElements.map((el) => (
                <div
                  key={el.value}
                  className={`paragraph-text pointer admin-panel-content__header-element ${
                    selectedAdminPanelModelTab === el.value ? 'paragraph-text--accent' : 'paragraph-text--secondary'
                  }`}
                  onClick={() =>
                    updateSetting('selectedAdminPanelModelTab', {
                      selectedAdminPanelModelTab: el.value as AdminPanelModelTab
                    })
                  }
                >
                  {el.name}
                </div>
              ))}
            </div>
            <div className="admin-panel-content__body">
              {selectedAdminPanelModelTab === 'users' && data && data.users && (
                <UsersTable key={data.users.length} originData={data.users} />
              )}
            </div>
          </div>
        )}
      </WidgetWrapper>
    </div>
  )
}
