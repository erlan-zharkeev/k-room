import './emoji-dropdown.scss'

import { Dropdown, MenuProps } from 'antd'

import { AppButton } from 'src/shared/ui'
import { EMOJI_LIST } from 'src/shared/config'

import { EmojiDropdownProps } from './emoji-dropdown.types.ts'

export const EmojiDropdown = ({ setEmoji = () => {} }: EmojiDropdownProps) => {
  const items: MenuProps['items'] = EMOJI_LIST.map((el) => {
    return {
      key: el.key,
      label: <span className="emoji-dropdown__icon">{el.glyph}</span>
    }
  })

  return (
    <Dropdown
      overlayClassName="emoji-dropdown"
      menu={{
        items,
        onClick: ({ key }) => {
          const emoji = EMOJI_LIST.find((el) => el.key === key)

          if (emoji) {
            setEmoji(emoji.glyph)
          }
        },
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
