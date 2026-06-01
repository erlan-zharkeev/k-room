import type { UserData } from 'global-shared'
import { defineStore } from 'pinia'

import { INITIAL_USER_STORE } from '../config/constants'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { ...INITIAL_USER_STORE } as UserData
  }),

  actions: {
    reset() {
      this.user = { ...INITIAL_USER_STORE }
    },

    update(payload: Partial<UserData>) {
      this.user = {
        ...this.user,
        ...payload
      }
    }
  }
})
