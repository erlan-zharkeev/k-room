import { createBrowserHistory } from 'history'
import { publicRoutes } from 'src/app/router/routes'
import { socket } from 'src/shared/api'

export const router = createBrowserHistory()

router.listen(({ location }) => {
  const path = location.pathname
  const isRoutePublic = Boolean(publicRoutes.find((route) => route.path === path))
  if (!isRoutePublic) return
  setTimeout(() => {
    socket.disconnect()
  })
})
