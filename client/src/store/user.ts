import {defineStore} from 'pinia'
import storage from "../utils/storage";

interface IUserInfo {
  token: string,
  userId: number,
  username: string,
}

export const usersStore = defineStore('users', {
  state: () => {
    return {
      username: '',
      token: '',
      userId: 0
    };
  },
  getters: {},
  actions: {
    storeUserInfo(userInfo: IUserInfo): void {
      const {username, token, userId} = userInfo
      this.username = username
      this.token = token
      this.userId = userId
      storage.setItem('userInfo', userInfo)
    }
  }
})
