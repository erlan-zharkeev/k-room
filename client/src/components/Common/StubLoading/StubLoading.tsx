import { StubLoadingProps } from './@types/StubLoadingProps'
import { LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { logOut } from 'src/store/userSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { socket } from 'src/socket/socket'
import useTypedSelector from 'src/hooks/useTypedSelector'

const StubLoading = ({ isLoading }: StubLoadingProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { reconnecting } = useTypedSelector((state) => state.system)
  const reconnect = () => {
    socket.connect()
  }
  return isLoading ? (
    <div className="stub-loading">
      {reconnecting ? (
        <div className="stub-loading__circle">
          <LoadingOutlined />
          <p className="header-text header-text__secondary">Socket reconnecting</p>
        </div>
      ) : (
        <div className="stub-loading__update-block">
          <p>Connection failed</p>
          <p>Try again later</p>
          <Button className="ant-btn--md" onClick={reconnect}>
            Reconnect
          </Button>
          <Button className="ant-btn--md" onClick={() => dispatch(logOut())}>
            Logout
          </Button>
        </div>
      )}
    </div>
  ) : (
    <></>
  )
}

export default StubLoading
