import { Dropdown, MenuProps } from 'antd'
import { clientConstants } from 'src/client-constants'
import { UIButton } from 'src/components'
import { ReactElement } from 'react'

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
        <UIButton type="dropdown" iconName="emoji" />
      </Dropdown>
    </div>
  )
}
