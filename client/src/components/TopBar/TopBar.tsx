import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { logOut } from 'src/store/userSlice'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { changeAsideTab, setCurrentInfoItem } from 'src/store/settingsSlice'
import UIButton from 'ui/UIButton'
import UIAvatar from 'ui/UIAvatar'
import { Badge, MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'

const TopBar = () => {
  const { username, email, avatar } = useTypedSelector((state) => state.user.userData)
  const { infoItems } = useTypedSelector((state) => state.user.userData)

  const [transformedIInfoItems, setTransformedInfoItems] = useState([])

  useEffect(() => {
    const updatedItems = infoItems.map((item) => {
      const updatedItem = { ...item, key: item.id }
      return updatedItem
    })
    setTransformedInfoItems(updatedItems)
  }, [infoItems])

  const dispatch = useDispatch<AppDispatch>()

  const resetChat = (e: any) => {
    // dispatch(selectChatRoom(''))
  }

  const exit = () => {
    dispatch(logOut())
  }

  const unreadInfoQuantity = () => infoItems.filter((item) => item.read === 'unread').length

  const infoItemClickHandler: MenuProps['onClick'] = ({ key }) => {
    const infoId = key
    dispatch(changeAsideTab('info'))
    dispatch(setCurrentInfoItem(infoId))
  }

  return (
    <div className="top-bar" onClick={resetChat}>
      <div className="top-bar__content">
        <div className="top-bar__userdata">
          <div className="top-bar__avatar">
            <UIAvatar online={socket.connected} src={avatar} />
          </div>
          <div className="top-bar__credential">
            <div className="paragraph-text top-bar__username">{username}</div>
            <div className="paragraph-text paragraph-text--secondary">{email}</div>
          </div>
        </div>
        <div className="top-bar__buttons">
          <Badge count={unreadInfoQuantity()}>
            <Dropdown
              menu={{ items: transformedIInfoItems, onClick: infoItemClickHandler }}
              trigger={['click']}
              placement="bottom"
            >
              <UIButton iconName="notification-bell" />
            </Dropdown>
          </Badge>
          <UIButton iconName="exit" onClick={() => exit()} />
        </div>
      </div>
    </div>
  )
}

export default TopBar
