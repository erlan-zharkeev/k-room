const LogoImage: string = require('src/assets/img/Logo.svg')

export const Logo = () => {
  return (
    <div className="logo">
      <img className="logo__image" src={LogoImage} alt="logo"></img>
    </div>
  )
}
