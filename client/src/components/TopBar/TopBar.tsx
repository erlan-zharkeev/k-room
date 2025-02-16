import { MenuProps, Dropdown } from 'antd'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AppDispatch, logOut } from 'src/store'
import { UIAvatar, UIButton } from '..'
import { $socket } from 'src/services'
import { WidgetWrapper } from '../shared'
import { Badge } from 'antd'

export const TopBar = () => {
  const { updateSetting } = useUpdateSettings()

  const { username, email, avatarPath } = useTypedSelector((state) => state.user.userData)
  const { infoItems } = useTypedSelector((state) => state.user.userData)
  const [transformedIInfoItems, setTransformedInfoItems] = useState([] as MenuProps['items'])

  useEffect(() => {
    const updatedItems = infoItems?.map((item) => {
      const updatedItem = { ...item, key: item.id }
      return updatedItem
    })
    if (!updatedItems) return
    setTransformedInfoItems(updatedItems)
  }, [infoItems])

  const dispatch = useDispatch<AppDispatch>()

  const exit = () => {
    dispatch(logOut())
  }

  const unreadInfoQuantity = () => Number(infoItems?.filter((item) => item.read === 'unread').length)

  const infoItemClickHandler: MenuProps['onClick'] = ({ key }) => {
    const infoId = key
    updateSetting('asideTab', { asideTab: 'info' })
    updateSetting('currentInfoId', { infoId })
  }

  return (
    <div className="top-bar">
      <WidgetWrapper>
        <div className="top-bar__content">
          <div className="top-bar__user-data">
            <div className="top-bar__avatar">
              <UIAvatar online={$socket.connected} src={avatarPath} />
            </div>
            <div className="top-bar__credential">
              <div className="paragraph-text top-bar__username">{username}</div>
              <div className="paragraph-text paragraph-text--secondary">{email}</div>
            </div>
          </div>
          <div className="top-bar__buttons">
            <div className="top-bar__info">
              <Dropdown
                menu={{ items: transformedIInfoItems, onClick: infoItemClickHandler }}
                trigger={['click']}
                placement="bottom"
              >
                <Badge color={`var(--error)`} count={unreadInfoQuantity()} size="small" offset={[-5, 2]}>
                  <UIButton iconName="notification-bell" />
                </Badge>
              </Dropdown>
            </div>
            <UIButton tooltip="Logout" iconName="exit" onClick={() => exit()} />
          </div>
        </div>
      </WidgetWrapper>
    </div>
  )
}
