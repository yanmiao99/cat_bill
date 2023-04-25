<template>
  <div class="income_table">
    <div class="header_operation">
      <el-form :inline="true" :model="incomeFormSearch">
        <el-form-item>
          <el-select v-model="incomeFormSearch.type" filterable clearable placeholder="按类型搜索">
            <el-option
                v-for="item in incomeFormOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <ElConfigProvider :locale="locale">
            <el-date-picker
                v-model="incomeFormDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :shortcuts="shortcuts"
            />
          </ElConfigProvider>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleIncomeSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleIncomeResize" plain>重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleIncomeAddOrEdit('add',{})">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
        :data="tableData"
        stripe
        border
        empty-text="暂无数据">
      <el-table-column align="center" label="ID" prop="id" sortable width="70"/>
      <el-table-column align="center" label="日期" prop="date" sortable/>
      <el-table-column align="center" label="类型" prop="type" sortable/>
      <el-table-column align="center" label="金额(¥)" prop="totalAmount" sortable/>
      <el-table-column align="center" label="是否到账" prop="isReceived" sortable>
        <template #default="scope">
          <el-tag v-if="scope.row.isReceived" type="success">已到账</el-tag>
          <el-tag v-else type="danger">未到账</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" :show-overflow-tooltip="true" prop="remark">
        <template #default="scope">
          <p v-if="scope.row.remark">{{ scope.row.remark }}</p>
          <p v-else> -- </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button plain type="primary" :icon="Edit" @click="handleIncomeAddOrEdit('edit',scope.row)"/>
          <el-popconfirm title="你确定删除该条数据吗?" @confirm="handleIncomeDelete(scope.row)">
            <template #reference>
              <el-button plain type="danger" :icon="Delete"/>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer_operation">
      <el-pagination
          background
          layout="prev, pager, next"
          v-model:page-size="income_page.limit"
          v-model:current-page="income_page.page"
          :total="income_page.totalCount"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {Delete, Edit} from "@element-plus/icons-vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {ElConfigProvider} from "element-plus";
import {shortcuts} from "@/utils";


const locale = ref(zhCn)

// 表格数据
const tableData = ref([
  {
    id: 1,
    date: '2021-01-01',
    type: '工资',
    totalAmount: 1000,
    isReceived: true,
    remark: '备注'
  },
  {
    id: 2,
    date: '2021-01-02',
    type: '其他',
    totalAmount: 2000,
    isReceived: false,
    remark: '备注'
  }
])

// 分页
const income_page = ref({
  page: 1, // 当前页数，即请求中传入的page参数。
  limit: 9, // 每页返回的数据量，即请求中传入的limit参数。
  totalCount: 0, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
})

// 新增或者编辑
const handleIncomeAddOrEdit = (type, row) => {
  console.log(type, row)
}

// 删除
const handleIncomeDelete = (row) => {
  console.log(row)
}

// 初始日期
const incomeFormDate = ref([])
const incomeFormOptions = ref([
  {
    value: '工资',
    label: '工资'
  },
  {
    value: '其他',
    label: '其他'
  },
  {
    value: '私单',
    label: '私单'
  },
  {
    value: '套现',
    label: '套现'
  },
])
// 搜索数据
const incomeFormSearch = ref({
  type: '',
  startTime: '',
  endTime: ''
})

// 查询按钮
const handleIncomeSearch = () => {
  console.log(incomeFormDate)
  console.log(incomeFormSearch)
}

// 重置按钮
const handleIncomeResize = () => {
  incomeFormDate.value = []
  incomeFormSearch.value = {}
}


</script>

<style scoped lang="scss">

</style>
