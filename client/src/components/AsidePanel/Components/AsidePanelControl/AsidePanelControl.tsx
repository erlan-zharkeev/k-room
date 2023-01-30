import { UserOutlined, WechatOutlined, SettingOutlined, PhoneOutlined } from '@ant-design/icons'
import { Radio, RadioChangeEvent, Tooltip } from 'antd'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { changeAsideTab } from 'src/store/settingsSlice'

const AsidePanelControl = () => {
  const { asideTab, showTooltips } = useTypedSelector((state) => state.persist.settings)
  const dispatch = useDispatch<AppDispatch>()

  const changTab = (e: RadioChangeEvent) => {
    dispatch(changeAsideTab(e.target.value))
  }

  const buttons = [
    { title: 'Contacts', value: 'users', icon: () => <UserOutlined /> },
    { title: 'Chat rooms', value: 'chatList', icon: () => <WechatOutlined /> },
    { title: 'Calls', value: 'calls', icon: () => <PhoneOutlined /> },
    { title: 'User settings', value: 'settings', icon: () => <SettingOutlined /> }
  ]

  const ButtonWrapper = (value: string, Icon: any) => (
    <Radio.Button value={value} className="transitionless">
      <Icon />
    </Radio.Button>
  )

  return (
    <div className="aside-panel-control">
      <Radio.Group value={asideTab} onChange={changTab}>
        {buttons.map((button) => {
          return showTooltips ? (
            <Tooltip key={button.value} placement="topLeft" title={button.title}>
              {ButtonWrapper(button.value, button.icon)}
            </Tooltip>
          ) : (
            <div key={button.value}>{ButtonWrapper(button.value, button.icon)}</div>
          )
        })}
      </Radio.Group>
    </div>
  )
}
export default AsidePanelControl
