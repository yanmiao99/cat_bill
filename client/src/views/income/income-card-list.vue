<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="12" :md="12" :lg="6" v-for="item in cardList" :key="item.title">
      <el-card shadow="hover">
        <div class="card_bg">
          {{ item.bgText }}
        </div>
        <div class="card_content">
          <p class="title">{{ item.title }}</p>
          <p class="amount">
            <count-to
                prefix="￥"
                :startVal="0"
                :endVal="item.value"
                :decimals="2"
                class="money"
                :duration="500"/>
          </p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {getIncomeListBoard} from "@/api/incomeList";
import {incomeStore} from "@/store/income";
import {storeToRefs} from "pinia";
import {CountTo} from 'vue3-count-to';

const store = incomeStore()

const {board_update} = storeToRefs(store);

// 监听store中的board_update
watch(board_update, (newVal, oldValue) => {
  if (newVal !== oldValue) {
    getBoardData()
  }
})

const getBoardData = async () => {
  const res = await getIncomeListBoard();
  let {dayIncome, monthIncome, yearIncome, monthSalary} = res;

  cardList.value = [
    {
      title: "今日收入",
      value: dayIncome || 0,
      bgText: '日'
    },
    {
      title: "本月收入",
      value: monthIncome || 0,
      bgText: '月'
    },
    {
      title: "今年收入",
      value: yearIncome || 0,
      bgText: '年'
    },
    {
      title: "本月工资",
      value: monthSalary || 0,
      bgText: '固'
    }
  ]
}

onMounted(() => {
  getBoardData()
})

const cardList = ref([])

</script>

<style scoped lang="scss">

.el-card {
  position: relative;
  margin-bottom: 10px;

  .card_bg {
    font-size: 80px;
    font-weight: bold;
    color: var(--el-border-color-extra-light);
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
      padding-left: 10px;
    }

    .amount {
      margin-top: 20px;
      color: var(--el-color-primary);

      .money {
        font-weight: bold;
        font-size: 30px;
        margin-left: 5px;
      }
    }
  }
}

</style>
