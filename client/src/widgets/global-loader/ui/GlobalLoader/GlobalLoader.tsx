import { useSystem } from 'src/entities/system'

import { AppProgressBar } from 'src/shared/ui'
import './style.scss'

export const GlobalLoader = () => {
  const { isAppLoading } = useSystem()
  return (
    <>
      {isAppLoading && (
        <div className="global-loader">
          <div className="global-loader__content">
            <AppProgressBar />
          </div>
        </div>
      )}
    </>
  )
}
