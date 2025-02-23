import './style.scss'
import { useEffect, useState } from 'react'
import {
  AdminEndpoints,
  AdminPanelModelTab,
  ChatRoom,
  IDBCallSchema,
  IMessageSchema,
  IUserSchema,
  Status
} from 'common-types'
import { useDispatch } from 'react-redux'
import { UsersTable } from './elements'
import { Button } from 'src/shared/ui'
import { useApi } from 'src/shared/api'
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper'
import { showModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'
import { useTypedSelector } from 'src/shared/lib'

interface IGetAppDataPayload {
  users: IUserSchema[]
  calls: IDBCallSchema[]
  chatRooms: ChatRoom[]
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
  const { updateSetting } = useSettings()
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
      <WidgetWrapper loading={loading} placement="main">
        {error ? (
          <p>Failed to get data</p>
        ) : (
          <div className="admin-panel-content__data">
            <div className="admin-panel-content__header">
              <h1 className="header-text header-text--secondary header-text--lg">Admin panel</h1>
              <div className="admin-panel-content__actions">
                <Button
                  text="Refresh"
                  border="common-border"
                  className="refresh-btn admin-panel-content__btn"
                  onClick={getData}
                />
                <Button
                  text="DB Сlear"
                  border="common-border"
                  className="db-reset-btn admin-panel-content__btn"
                  onClick={dbClearLoaderHandler}
                />
                <Button
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
