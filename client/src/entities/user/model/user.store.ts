import { defineStore } from 'pinia'

import { INITIAL_USER_STORE } from '../config/constants'

import type { User } from './types'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: { ...INITIAL_USER_STORE } as User
  }),

  actions: {
    reset() {
      this.user = { ...INITIAL_USER_STORE }
    },

    update(payload: Partial<User>) {
      this.user = {
        ...this.user,
        ...payload
      }
    }
  }
})
