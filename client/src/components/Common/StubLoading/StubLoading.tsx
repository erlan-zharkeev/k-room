import { StubLoadingProps } from './@types/StubLoadingProps'
import { logOut } from 'src/store/userSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { socket } from 'src/socket/socket'
import useTypedSelector from 'src/hooks/useTypedSelector'
import UIButton from 'ui/UIButton'
import UIIcon from 'ui/UIIcon'

const StubLoading = ({ isLoading }: StubLoadingProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { reconnecting } = useTypedSelector((state) => state.system)
  const reconnect = () => {
    socket.connect()
  }
  const exit = () => {
    dispatch(logOut())
  }
  return (
    isLoading && (
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
              <UIButton borderless={false} text="Reconnect" onClick={reconnect} />
              <UIButton borderless={false} text="Logout" onClick={exit} />
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default StubLoading
