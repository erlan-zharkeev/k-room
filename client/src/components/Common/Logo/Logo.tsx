import { RouteNames } from 'common-types'
import { useNavigate } from 'react-router-dom'

const LogoImage: string = require('src/assets/img/Logo.svg')

export const Logo = () => {
  const navigate = useNavigate()

  return (
    <div className="logo" onClick={() => navigate(RouteNames.MAIN)}>
      <img className="logo__image" src={LogoImage} alt="logo"></img>
    </div>
  )
}
