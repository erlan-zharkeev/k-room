import { Dropdown, MenuProps } from 'antd'
import emojiSource from './emojis'
import { EmojiDropdownProps } from './@types/EmojiDropdownProps'
import UIButton from 'ui/UIButton'

export const EmojiDropDown = ({ setEmoji = () => {} }: EmojiDropdownProps) => {
  const items: MenuProps['items'] = emojiSource.map((el) => {
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
export default EmojiDropDown
