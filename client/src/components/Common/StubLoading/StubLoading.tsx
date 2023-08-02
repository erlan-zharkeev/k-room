import { logOut } from 'src/store/userSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

import useTypedSelector from 'src/hooks/useTypedSelector'
import { UIIcon, UIButton } from 'src/components/UI'

const StubLoading = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { reconnecting } = useTypedSelector((state) => state.system)
  const reconnect = () => {
    $socket.connect()
  }
  const exit = () => {
    dispatch(logOut())
  }
  return (
    <div className="stub-loading">
      {reconnecting ? (
        <div className="stub-loading__circle">
          <UIIcon name="loader" color="accent" size="large" />
          <p className="header-text header-text--secondary">Socket reconnecting</p>
        </div>
      ) : (
        <div className="stub-loading__update-block">
          <p className="paragraph-text paragraph-text--secondary paragraph-text--md">Connection failed</p>
          <p className="paragraph-text paragraph-text--secondary paragraph-text--md">Try again later</p>

          <div className="stub-loading__controls">
            <UIButton border="border-default" text="Reconnect" onClick={reconnect} />
            <UIButton border="border-default" text="Logout" onClick={exit} />
          </div>
        </div>
      )}
    </div>
  )
}

export default StubLoading
