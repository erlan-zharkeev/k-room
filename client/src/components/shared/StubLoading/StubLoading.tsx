import { useDispatch } from 'react-redux'
import { UIIcon, UIButton } from 'src/components'
import { useTypedSelector } from 'src/hooks'
import { socketReconnect } from 'src/services/$socket'
import { AppDispatch, logOut } from 'src/store'

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
          <p className="header-text header-text--secondary">Reconnecting</p>
        </div>
      ) : (
        <div className="stub-loading__update-block">
          <p className="paragraph-text paragraph-text--secondary paragraph-text--md">Connection failed</p>
          <p className="paragraph-text paragraph-text--secondary paragraph-text--md">Try again later</p>

          <div className="stub-loading__controls">
            <UIButton border="common-border" text="Reconnect" onClick={reconnect} />
            <UIButton border="common-border" text="Logout" onClick={exit} />
          </div>
        </div>
      )}
    </div>
  )
}
