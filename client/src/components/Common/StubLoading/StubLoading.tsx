import { useDispatch } from 'react-redux'
import { UIIcon, UIButton } from 'src/components'
import { useTypedSelector } from 'src/hooks'
import { socketReconnect } from 'src/services/$socket'
import { AppDispatch } from 'src/store'
import { logOut } from 'src/store/user-slice'

export const StubLoading = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { reconnecting } = useTypedSelector((state) => state.system)
  const reconnect = () => {
    socketReconnect(dispatch)
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
