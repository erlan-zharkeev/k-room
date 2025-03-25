import './styles.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/shared/lib'
import { AppIcon, AppButton } from 'src/shared/ui'
import { AppDispatch } from 'src/app/store'
import { socketReconnect } from 'src/shared/api'
import { logOut } from 'src/entities/user'

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
          <AppIcon name="loader" color="accent-color" size="large" />
          <p className="header-text header-text--secondary">Reconnecting</p>
        </div>
      ) : (
        <div className="stub-loading__update-block">
          <p className="paragraph-text  paragraph-text--md">Connection failed</p>
          <p className="paragraph-text  paragraph-text--md">Try again later</p>

          <div className="stub-loading__controls">
            <AppButton text="Reconnect" onClick={reconnect} />
            <AppButton text="Logout" onClick={exit} />
          </div>
        </div>
      )}
    </div>
  )
}
