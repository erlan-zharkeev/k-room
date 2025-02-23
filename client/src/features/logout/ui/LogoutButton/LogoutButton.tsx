import { Button } from 'src/shared/ui'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { logOut } from 'src/entities/user'

export const LogoutButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  return <Button tooltip="Logout" iconName="exit" onClick={() => dispatch(logOut())} />
}
