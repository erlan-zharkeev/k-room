import { readonly, ref } from 'vue'

const isSocketConnected = ref(false)
const isSocketReconnecting = ref(false)
const isSocketReconnectFailed = ref(false)

export const socketStatus = {
  isConnected: readonly(isSocketConnected),
  isReconnectFailed: readonly(isSocketReconnectFailed),
  isReconnecting: readonly(isSocketReconnecting)
}

export const setSocketConnected = (value: boolean) => {
  isSocketConnected.value = value
}

export const setSocketReconnecting = (value: boolean) => {
  isSocketReconnecting.value = value
}

export const setSocketReconnectFailed = (value: boolean) => {
  isSocketReconnectFailed.value = value
}
