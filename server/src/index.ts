import { runServer } from 'src/app/services'

runServer().catch((error) => {
  console.error('-Server startup failed')
  console.error(String(error))
})
