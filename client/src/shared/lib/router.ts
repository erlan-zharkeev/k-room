import { createBrowserHistory } from 'history'

import { socket } from 'src/shared/api'

export const router = createBrowserHistory()

router.listen(({ location }) => {
  // const path = location.pathname
  // const isRoutePublic = Boolean(publicRoutes.find((route) => route.path === path))
  // if (!isRoutePublic) return
  // setTimeout(() => {
  //   socket.disconnect()
  // })
})
