/*
*  storage 二次封装
*  功能 :
*   1. 命名空间实现 , 防止不同项目数据混淆
*   2. 存储类型支持 object
*   3. 支持删除单项
* */

import config from "../config/config"

export default {
    setItem(key:string, val:any) {
        /*
        * 思路 :
        * 先取出命名空间里面的内容, 然后通过命名空间的 key 值进行添加,以免造成全局污染 , 并且支持传入 object
        * */
        let storage = this.getStorage()
        storage[key] = val
        window.localStorage.setItem(config.namespace, JSON.stringify(storage))
    },
    getItem(key:string) {
        return this.getStorage()[key]
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
    },
    clearItem(key:string) {
        let storage = this.getStorage()
        delete storage[key]
        window.localStorage.setItem(config.namespace, JSON.stringify(storage))
    },
    clearAll() {
        window.localStorage.clear()
    }
}
