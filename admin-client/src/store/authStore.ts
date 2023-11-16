
import { defineStore } from 'pinia'

export const useUserDataStore = defineStore({
  id: 'user-data',
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setUser(user: User) {
      this.user = user
    },
    setToken(token: string) {
      this.token = token
    },
    clearUserData() {
      this.user = null
      this.token = null
    },
  },
})
