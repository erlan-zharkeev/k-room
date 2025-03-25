import { AppButton } from 'src/shared/ui'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { logOut } from 'src/entities/user'

export const LogoutButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  const logoutHandler = () => {
    dispatch(logOut())
  }
  return <AppButton tooltip="Logout" prefixIconName="exit" onClick={logoutHandler} borderless />
}
