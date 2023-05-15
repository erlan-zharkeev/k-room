import ShortContactsList from './Components/ShortContactsList'
import { useState } from 'react'
import UIIcon from 'src/components/UI/UIIcon'
import UIInput from 'src/components/UI/UIInput'
import useTypedSelector from 'src/hooks/useTypedSelector'

const ForwardMessagePopup = () => {
  const [searchString, setSearchString] = useState('')
  const { message } = useTypedSelector((state) => state.system.contextMenu.contextClickedObject)
  const clickContactHandler = (userId: string) => {
    console.log(message, userId)
  }
  return (
    <div className="forward-message-popup">
      <div className="tech-settings-popup__select">
        <UIInput
          size="small"
          suffix={<UIIcon name={'search'} color={'default'} />}
          onChange={async (e) => setSearchString(e.target.value)}
        />
        <ShortContactsList searchString={searchString} clickContact={clickContactHandler} />
      </div>
    </div>
  )
}

export default ForwardMessagePopup
