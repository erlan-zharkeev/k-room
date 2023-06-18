import { Dropdown, MenuProps } from 'antd'
import { EmojiDropdownProps } from './@types/EmojiDropdownProps'
import UIButton from 'src/components/UI/UIButton/UIButton'
import constants from 'src/constants'

const EmojiDropDown = ({ setEmoji = () => {} }: EmojiDropdownProps) => {
  const items: MenuProps['items'] = constants.emojis.map((el) => {
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
