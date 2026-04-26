import { readonly, ref } from 'vue'

const isSocketConnected = ref(false)
const isSocketReconnecting = ref(false)

export const socketStatus = {
  isConnected: readonly(isSocketConnected),
  isReconnecting: readonly(isSocketReconnecting)
}

export const setSocketConnected = (value: boolean) => {
  isSocketConnected.value = value
}

export const setSocketReconnecting = (value: boolean) => {
  isSocketReconnecting.value = value
}
