import { RouteNames } from 'common-types'
import { useNavigate } from 'react-router-dom'
import { LogoImage } from 'src/assets'

export const Logo = ({ showPointer = true }: { showPointer?: boolean }) => {
  const navigate = useNavigate()

  return (
    <div className={`logo ${showPointer ? 'pointer' : ''}`} onClick={() => navigate(RouteNames.MAIN)}>
      <img className="logo__image" src={LogoImage} alt="logo"></img>
    </div>
  )
}
