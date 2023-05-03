<!--
思路 :
  1. 在路由中定义 meta 原数据
  2. 用 this.$route.matched 进行数组
  3. 循环遍历 matched 数组获取 meta.title 即可
-->
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
        v-for="(item, index) in breadCrumbList"
        :key="item.path">
      <router-link :to="{ path: item.path }" v-if="index === 0">
        {{ item.meta.title }}
      </router-link>
      <span v-else>
        {{ item.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import {useRoute} from "vue-router";

const route = useRoute()

const title = ref('')
const breadCrumbList = computed(() => {
  return route.matched
})
</script>
