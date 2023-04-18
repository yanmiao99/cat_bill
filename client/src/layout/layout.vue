<template>
  <div class="basic-layout ">
    <div class="nav-side">
      <div class="logo" v-show="!isCollapse">
        <img src="@/assets/images/logo.png" alt="logo">
        <h1>{{ config.globalName }}</h1>
      </div>
      <el-menu
          class="el-menu-vertical"
          active-text-color="#ffca39"
          background-color="#fff"
          text-color="#333"
          :collapse="isCollapse"
          router
          :default-active="defaultActive"
      >
        <el-menu-item :index="item.path" v-for="item in routerMenu" :key="item.name">
          <el-icon>
            <component :is="item.icon"/>
          </el-icon>
          <template #title>
            <span>{{ item.meta?.title }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">
          <div @click="handleIsCollapse">
            <el-icon v-if="isCollapse">
              <Expand/>
            </el-icon>
            <el-icon v-else>
              <Fold/>
            </el-icon>
          </div>
        </div>
        <div class="user-info">
          <!-- 下拉菜单 -->
          <el-dropdown trigger="click" @command="handleLogout">
            <div class="user-info-tools">
              <span>{{username}}</span>
              <el-icon>
                <Tools/>
              </el-icon>
            </div>
            <span class="el-dropdown-link"></span>
            <template #dropdown>
              <el-dropdown-menu>
                <!--<el-dropdown-item command="email">邮箱 : {{ userInfo.userEmail }}</el-dropdown-item>-->
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref} from "vue"
import {useRouter} from "vue-router"
import {routerMenu} from "../router/routerMenu";
import config from "../config/config";
import storage from "../utils/storage";
import {getCurrentUserInfo} from "../api/user";

const router = useRouter()

let isCollapse: Ref<boolean> = ref(false)

const username = ref('')

onMounted(async () => {
  // isCollapse本地获取
  let storage_isCollapse = storage.getItem('isCollapse') || '0'
  if (storage_isCollapse) {
    isCollapse.value = storage_isCollapse === '1'
  }

  // 获取当前用户信息
  let currentUserInfo = await getCurrentUserInfo()
  username.value = currentUserInfo.username

})


// 获取当前路由
let defaultActive: Ref<string> = ref(location.hash.slice(1))

// 菜单收缩
const handleIsCollapse = () => {
  isCollapse.value = !isCollapse.value
  // isCollapse存储本地
  storage.setItem('isCollapse', isCollapse.value ? '1' : '0')
}

// 退出登录
const handleLogout = (key: string) => {
  router.push('/login')
}

</script>

<style scoped lang="scss">
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: v-bind("isCollapse ? '60px' : '200px'");
    height: 100vh;
    background: #fff;
    overflow-y: auto;
    transition: width 0.3s;
    color: #fff;
    border-right: 1px solid #ddd;

    .logo {
      padding: 20px;
      text-align: center;
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 40px;
        height: 40px;
      }

      h1 {
        margin-left: 10px;
        width: 70px;
        line-height: 1.7em;
        color: #ffca39;
      }
    }

    .el-menu-vertical {
      border-right: 0;
    }

    .el-menu-item {
      width: v-bind("isCollapse ? '100%' : '90%'");
      margin: 0 auto;

      &:hover {
        background-color: transparent;
        color: var(--el-color-primary);
      }

      &.is-active {
        background-color: var(--el-color-primary-light-9);
        border-radius: 10px;
      }
    }
  }

  .content-right {
    margin-left: v-bind("isCollapse ? '60px' : '200px'");
    transition: margin-left 0.3s;

    .nav-top {
      background: #fff;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333;
      padding: 10px 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;

      .bread {
        display: flex;
        align-items: center;

        .el-icon {
          margin-right: 10px;
          cursor: pointer;
        }
      }

      .user-info {
        margin-top: 5px;
        display: flex;
        cursor: pointer;

        .user-info-tools {
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            margin-right: 5px;
          }
        }
      }
    }

    .wrapper {
      height: calc(100vh - 50px);
      background: #ECEEF1;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}

</style>
