import {defineStore} from 'pinia'
export const usersStore = defineStore('users', {
  state: () => {
    return {
      account: "",
      password: '',
      autoLogin: false
    };
  },
})
