import axios from 'axios'

axios.defaults.withCredentials = true

export const httpClient = axios
