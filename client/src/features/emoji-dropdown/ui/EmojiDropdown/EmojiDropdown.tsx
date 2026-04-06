import './style.scss'

import { Dropdown, MenuProps } from 'antd'

import { IEmojiDropdownProps } from 'src/features/emoji-dropdown'

import { EMOJI_LIST } from 'src/entities/emoji'

import { AppButton } from 'src/shared/ui'

export const EmojiDropdown = ({ setEmoji = () => {} }: IEmojiDropdownProps) => {
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
