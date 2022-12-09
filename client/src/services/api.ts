
import axios from 'axios'
import ENV from 'src/ENV'

axios.defaults.proxy = {
  host: ENV.HOST,
  port: Number(ENV.SERVER_PORT)
}

const $api = axios

export default $api