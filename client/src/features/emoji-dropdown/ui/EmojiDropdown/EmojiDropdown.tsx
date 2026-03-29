import './style.scss'

import { Dropdown, MenuProps } from 'antd'

import type { IEmojiDropdownProps } from 'src/features/emoji-dropdown/ui'

import { EMOJI_LIST } from 'src/entities/emoji'

import { AppButton } from 'src/shared/ui'

export const EmojiDropdown = ({ setEmoji = () => {} }: IEmojiDropdownProps) => {
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
