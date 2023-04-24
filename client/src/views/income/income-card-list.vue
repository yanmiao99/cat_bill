<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="12" :md="12" :lg="6" v-for="item in cardList" :key="item.title">
      <el-card shadow="hover">
        <div class="card_bg">
          {{ item.title === '工资' ? '固' : item.title[0] }}
        </div>
        <div class="card_content">
          <p class="title">{{ item.title }}</p>
          <p class="amount"><span>¥</span>{{ item.value }}</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {ref} from "vue";

const cardList = ref([
  {
    title: "日收入",
    value: "4820.00",
  },
  {
    title: "月收入",
    value: "12310.00",
  },
  {
    title: "年收入",
    value: "12412.00",
  },
  {
    title: "工资",
    value: "14114.00",
  }
])
</script>

<style scoped lang="scss">

.el-card {
  position: relative;
  margin-bottom: 20px;

  .card_bg {
    font-size: 80px;
    font-weight: bold;
    color: #F4F6FA;
    position: absolute;
    right: 10px;
    top: 10px;
    pointer-events: none;
  }

  .card_content {
    display: flex;
    flex-direction: column;

    .title {
      font-weight: bold;
      font-size: 16px;
      color: #999;
    }

    .amount {
      margin-top: 20px;
      font-weight: bold;
      font-size: 30px;
      color: var(--el-color-primary);
      vertical-align: bottom;

      span {
        font-size: 20px;
        vertical-align: bottom;
        margin-right: 5px;
      }
    }
  }
}

</style>
