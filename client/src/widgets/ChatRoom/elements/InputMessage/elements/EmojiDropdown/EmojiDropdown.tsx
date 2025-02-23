import './style.scss'
import { Dropdown, MenuProps } from 'antd'
import { clientConstants } from 'src/client-constants'
import { ReactElement } from 'react'
import { Button } from 'src/shared/ui'

export interface EmojiDropdownProps {
  setEmoji?: (value: string) => void
}

export interface IEmojiItems {
  key: string
  label?: ReactElement
  glyph: string
}

export const EmojiDropdown = ({ setEmoji = () => {} }: EmojiDropdownProps) => {
  const items: MenuProps['items'] = clientConstants.emojis.map((el) => {
    return {
      key: el.key,
      label: (
        <span className="emoji-dropdown__icon" onClick={() => setEmoji(el.glyph)}>
          {el.glyph}
        </span>
      )
    }
  })

  return (
    <div className="emoji-dropdown">
      <Dropdown
        menu={{
          items,
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 50px)'
          }
        }}
        placement="topLeft"
        trigger={['click']}
      >
        <Button type="dropdown" iconName="emoji" />
      </Dropdown>
    </div>
  )
}
