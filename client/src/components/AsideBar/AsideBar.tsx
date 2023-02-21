import { Radio, RadioChangeEvent } from 'antd'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { changeAsideTab } from 'src/store/settingsSlice'
import { IoIosContacts } from 'react-icons/io'
import { IoChatboxEllipsesSharp } from 'react-icons/io5'
import { TbPhoneCall } from 'react-icons/tb'
import { FiSettings } from 'react-icons/fi'

const AsideBar = () => {
  const { asideTab } = useTypedSelector((state) => state.persist.settings)
  const dispatch = useDispatch<AppDispatch>()

  const changTab = (e: RadioChangeEvent) => {
    dispatch(changeAsideTab(e.target.value))
  }

  const buttons = [
    { title: 'Contacts', value: 'users', icon: () => <IoIosContacts /> },
    { title: 'Chat rooms', value: 'chatList', icon: () => <IoChatboxEllipsesSharp /> },
    { title: 'Calls', value: 'calls', icon: () => <TbPhoneCall /> },
    { title: 'User settings', value: 'settings', icon: () => <FiSettings /> }
  ]

  const ButtonWrapper = (value: string, Icon: any) => (
    <Radio.Button value={value} className="transitionless borderless">
      <Icon />
    </Radio.Button>
  )

  return (
    <div className="aside-bar">
      <Radio.Group size='large' value={asideTab} onChange={changTab}>
        {buttons.map((button) => {
          return <div key={button.value}>{ButtonWrapper(button.value, button.icon)}</div>
        })}
      </Radio.Group>
    </div>
  )
}
export default AsideBar
