import { AppProgressBar } from 'src/shared/ui'
import { useSystem } from 'src/entities/system'
import './style.scss'

export const AppLoader = () => {
  const { isAppLoading } = useSystem()
  return (
    <>
      {isAppLoading && (
        <div className="app-loader">
          <div className="app-loader__content">
            <AppProgressBar />
          </div>
        </div>
      )}
    </>
  )
}
