import { AppButton } from 'src/shared/ui'

import { useFirebase } from '../../hooks'

export const FirebaseProviderLoginBtn = () => {
  const { loading, firebaseLogin } = useFirebase()

  return (
    <>
      <AppButton
        prefixIconName="google"
        iconSize="xs"
        text="Sign in with Google"
        onClick={() => {
          firebaseLogin('google')
        }}
        loading={loading}
        hoverless
      />
    </>
  )
}
