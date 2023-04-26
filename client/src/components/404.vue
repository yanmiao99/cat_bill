<template>
  <div class="pager_not">
    <img src="@/assets/images/404.svg" alt="404">
    <p>页面丢失了~</p>
    <el-button type="primary" @click="goHome">返回首页 ({{ num }})</el-button>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter()

const num = ref(5)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    num.value--
    if (num.value === 0) {
      clearInterval(timer)
      router.push('/')
    }
  }, 1000)
})

const goHome = () => {
  clearInterval(timer)
  router.push('/')
}


</script>

<style scoped lang="scss">
.pager_not {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 200px;
  }

  p {
    font-size: 30px;
    margin: 30px 0;
  }
}
</style>
