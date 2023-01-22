import { StubLoadingProps } from './@types/StubLoadingProps'
import { LoadingOutlined } from '@ant-design/icons'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { Button } from 'antd'
import { update } from 'lodash'
import { logOut } from 'src/store/userSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

const StubLoading = ({ isLoading }: StubLoadingProps) => {
  const { reconnectAttempts } = useTypedSelector((state) => state.persist.system)
  const dispatch = useDispatch<AppDispatch>()

  return isLoading ? (
    <div className="stub-loading">
      {reconnectAttempts > 1 ? (
        <div className="stub-loading__circle">
          <LoadingOutlined />
          <p className="header-text header-text__secondary">Socket reconnecting</p>
        </div>
      ) : (
        <div className="stub-loading__update-block">
          <span>Connection failed</span>
          <Button onClick={() => dispatch(logOut)}>Reload page</Button>
        </div>
      )}
    </div>
  ) : (
    <></>
  )
}

export default StubLoading
