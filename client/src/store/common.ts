import {defineStore} from 'pinia'

export const commonStore = defineStore('common', {
    state: () => {
        return {
            darkMode: ''
        };
    },
    getters: {
        // 获取当前颜色模式
        getDarkMode() {
            let storageTheme = window.localStorage.getItem('vueuse-color-scheme');
            if (storageTheme === 'dark') {
                storageTheme = 'dark'
            } else if (storageTheme === 'light') {
                storageTheme = ''
            } else {
                const media = window.matchMedia('(prefers-color-scheme:dark)');
                if (media.matches) {
                    storageTheme = 'dark'
                } else {
                    storageTheme = ''
                }
            }

            let theme

            if (this.darkMode === 'dark' || storageTheme === 'dark') {
                theme = 'dark'
            } else {
                theme = ''
            }
            return theme;
        }
    },
    actions: {
        setDarkMode(mode: string) {
            this.darkMode = mode;
        }
    }
})
