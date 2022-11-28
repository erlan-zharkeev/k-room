import { Dropdown, Button, Menu } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import emojiSource from './emojis'
import { EmojiDropdownProps } from './@types/EmojiDropdownProps'

export const EmojiDropDown = ({ setEmoji = () => {} }: EmojiDropdownProps) => {
  const emojis = emojiSource.map((el) => {
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
      <Dropdown overlay={<Menu id="emoji-menu" items={emojis}></Menu>} placement="topLeft">
        <Button ghost icon={<SmileOutlined />}></Button>
      </Dropdown>
    </div>
  )
}
export default EmojiDropDown
