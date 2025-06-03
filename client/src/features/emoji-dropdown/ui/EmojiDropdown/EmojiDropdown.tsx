import './style.scss'
import { ReactElement } from 'react'

import { Dropdown, MenuProps } from 'antd'

import { EMOJI_LIST } from 'src/entities/emoji'

import { AppButton } from 'src/shared/ui'

export interface EmojiDropdownProps {
  setEmoji?: (value: string) => void
}

export interface IEmojiItems {
  key: string
  label?: ReactElement
  glyph: string
}

export const EmojiDropdown = ({ setEmoji = () => {} }: EmojiDropdownProps) => {
  const items: MenuProps['items'] = EMOJI_LIST.map((el) => {
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
    <Dropdown
      overlayClassName="emoji-dropdown"
      menu={{
        items,
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 60px)'
        }
      }}
      placement="topLeft"
      trigger={['click']}
    >
      <AppButton prefixIconName="emoji" borderless />
    </Dropdown>
  )
}
