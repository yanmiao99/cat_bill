import {defineStore} from 'pinia'
import storage from "../utils/storage";

export const incomeStore = defineStore('income', {
  state: () => {
    return {
      board_update: false
    };
  },
})
