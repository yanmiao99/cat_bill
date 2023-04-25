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
      <el-table-column align="center" label="金额(¥)" prop="amount" sortable/>
      <el-table-column align="center" label="是否到账" prop="isReceived" sortable>
        <template #default="scope">
          <el-tag v-if="scope.row.isReceived === 1" type="success">已到账</el-tag>
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

    <table-dialog
        v-model:visible="tableDialogVisible"
        :type="tableDialogType"
        :data="tableClickRow"
    />


  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {Delete, Edit} from "@element-plus/icons-vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {ElConfigProvider, ElMessage} from "element-plus";
import {shortcuts} from "@/utils";
import {getIncomeListInfo, deleteIncomeListInfo} from "@/api/incomeList";
import dayjs from "dayjs";
import TableDialog from "./table-dialog.vue";

const locale = ref(zhCn)

onMounted(() => {
  getIncomeList()
})

// 表格数据
const tableData = ref([])

// 分页
const income_page = ref({
  page: 1, // 当前页数，即请求中传入的page参数。
  limit: 8, // 每页返回的数据量，即请求中传入的limit参数。
  totalCount: 0, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
})

// 请求表格数据
const getIncomeList = async () => {
  const res = await getIncomeListInfo({
    page: income_page.value.page,
    limit: income_page.value.limit
  })

  res.list.forEach(item => {
    item.date = dayjs(item.date).format('YYYY-MM-DD')
  })

  tableData.value = res.list
  income_page.value = res.pagination
}

// 弹窗相关
const tableDialogVisible = ref(false)
const tableDialogType = ref('add')
const tableClickRow = ref({})

// 新增或者编辑
const handleIncomeAddOrEdit = (type, row) => {
  tableDialogType.value = type
  tableClickRow.value = row
  tableDialogVisible.value = true
}

// 删除
const handleIncomeDelete = async (row) => {
  try {
    await deleteIncomeListInfo({
      id: row.id
    })
    await getIncomeList()
    ElMessage.success('删除成功')
  } catch (e) {
    
  }
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


// 监听分页
watch(
    () => ({
      card_page: income_page.value.page,
      dialog_visible: tableDialogVisible.value
    }),
    async (newVal, oldVal) => {
      if (newVal.card_page !== oldVal.card_page) {
        await getIncomeList()
      }
      // 需要在关闭弹窗的时候, 重新请求一下数据, 以保证数据是最新的
      if (newVal.dialog_visible === false && oldVal.dialog_visible === true) {
        await getIncomeList()
      }
    }
)


</script>

<style scoped lang="scss">

</style>
