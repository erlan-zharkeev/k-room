import { ReactNode } from 'react'
import { UIIcon, Logo, AuthNav } from 'src/components'
import { useTypedSelector } from 'src/hooks'

export const SignInFormLayoutPage = (props: { children: ReactNode, hideAuthNav?: boolean }) => {
  const { isAppLoading } = useTypedSelector((state) => state.system)

  return (
    <div className="page sign-in-form-layout">
      {isAppLoading ? (
        <div className="sign-in-form-layout__loader">
          <div className="sign-in-form-layout__loader-content">
            <UIIcon name="loader" color="accent" size="large" />
            <h3 className="header-text header-text--md">Loading</h3>
          </div>
        </div>
      ) : (
        <>
          <Logo />
          <div className="sign-in-form-layout__wrapper">
            <div className="sign-in-form-layout__body">
              {!props.hideAuthNav && <AuthNav />}
              {props.children}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
