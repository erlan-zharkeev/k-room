import './style.scss'
import { Dropdown, Badge, MenuProps } from 'antd'
import { useState, useEffect } from 'react'
import { useSettings } from 'src/entities/settings'
import { useUser } from 'src/entities/user'
import { AppButton } from 'src/shared/ui'

export const InfoDropdown = () => {
  const { updateSetting } = useSettings()
  const { infoItems } = useUser()
  const [transformedIInfoItems, setTransformedInfoItems] = useState([] as MenuProps['items'])

  useEffect(() => {
    const updatedItems = infoItems?.map((item) => {
      const updatedItem = { ...item, key: item.id }
      return updatedItem
    })
    if (!updatedItems) return
    setTransformedInfoItems(updatedItems)
  }, [infoItems])

  const unreadInfoQuantity = () => Number(infoItems?.filter((item) => item.read === 'unread').length)

  const infoItemClickHandler: MenuProps['onClick'] = ({ key }) => {
    const infoId = key
    updateSetting('selectedContentElement', { selectedContentElement: 'info' })
    updateSetting('currentInfoId', { infoId })
  }

  return (
    <Dropdown
      menu={{ items: transformedIInfoItems, onClick: infoItemClickHandler }}
      trigger={['click']}
      placement="bottom"
      className="info-dropdown"
    >
      <Badge color={`var(--error)`} count={unreadInfoQuantity()} offset={[-5, 2]}>
        <AppButton prefixIconName="notification" borderless />
      </Badge>
    </Dropdown>
  )
}
