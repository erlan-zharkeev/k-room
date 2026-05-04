import { defineStore } from 'pinia'

import { INITIAL_SYSTEM_STORE } from '../config/constants'

export const useSystemStore = defineStore('system', {
  state: () => ({
    ...INITIAL_SYSTEM_STORE
  }),

  actions: {
    setHasInteracted(payload: boolean) {
      this.hasInteracted = payload
    },

    reset() {
      this.$patch({ ...INITIAL_SYSTEM_STORE })
    }
  }
})
