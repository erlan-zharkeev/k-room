import { createBrowserHistory } from 'history'
import { publicRoutes } from 'src/router/routes'
import { socket } from 'src/socket/socket'

const $router = createBrowserHistory()

$router.listen(({ location }) => {
  const path = location.pathname
  const isRoutePublic = Boolean(publicRoutes.find((route) => route.path === path))
  if (!isRoutePublic) return
  setTimeout(() => {
    socket.disconnect()
  })
})

export default $router