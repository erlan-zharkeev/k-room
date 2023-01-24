import { createBrowserHistory } from 'history'
import { publicRoutes } from 'src/router/routes'
import { socket } from 'src/socket/socket'

export const $router = createBrowserHistory()

export default $router

$router.listen(({ action, location }) => {
  const path = location.pathname
  const isRoutePublic = Boolean(publicRoutes.find((route) => route.path === path))
  if (!isRoutePublic) return
  setTimeout(() => {
    socket.disconnect()
  }, 0)
})