<template>
  <div class="income_table">
    <div class="header_operation">
      <el-form :inline="true" :model="incomeFormSearch">
        <el-form-item label="类型">
          <el-select v-model="incomeFormSearch.type" filterable clearable placeholder="按类型搜索">
            <el-option
                v-for="item in typeOptions"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
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
          <el-button type="primary" @click="getIncomeList">查询</el-button>
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
      <el-table-column align="center" label="类型" prop="type" sortable>
        <template #default="scope">
          <div class="type_box">
          <span
              class="type_dot"
              :style="{backgroundColor:typeFormatter(scope.row.type)}">
          </span>
            <span
                class="type_text"
                :style="{color:typeFormatter(scope.row.type)}">
            {{ scope.row.type }}</span>
          </div>
        </template>
      </el-table-column>
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
import {ElMessage, ElConfigProvider} from "element-plus";
import {getIncomeListInfo, deleteIncomeListInfo} from "@/api/incomeList";
import dayjs from "dayjs";
import TableDialog from "./table-dialog.vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {shortcuts} from "@/utils";
import {incomeStore} from "@/store/income";

const store = incomeStore()
const locale = ref(zhCn)

onMounted(() => {
  getIncomeList()
})

// type 颜色格式化
const typeFormatter = (cellValue) => {
  return cellValue === '工资' ? '#409EFF' : cellValue === '私单' ? '#67C23A' : '#E6A23C'
}

// 表格数据
const tableData = ref([])

// 分页
const income_page = ref({
  page: 1, // 当前页数，即请求中传入的page参数。
  limit: 8, // 每页返回的数据量，即请求中传入的limit参数。
  totalCount: 0, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
})

// 收入类型
const typeOptions = ref([])

// 日期选择器
const incomeFormDate = ref([])

// 搜索数据
const incomeFormSearch = ref({
  type: '',
  startTime: '',
  endTime: ''
})

// 请求表格数据
const getIncomeList = async () => {
  const {page, limit} = income_page.value;
  let params = {page, limit};

  if (incomeFormSearch.value.type) {
    params.type = incomeFormSearch.value.type;
  }

  if (incomeFormDate.value && incomeFormDate.value.length > 0) {
    params.startTime = dayjs(incomeFormDate.value[0]).format("YYYY-MM-DD");
    params.endTime = dayjs(incomeFormDate.value[1]).format("YYYY-MM-DD");
  }

  const res = await getIncomeListInfo(params);
  tableData.value = processData(res.list);
  typeOptions.value = res.options;
  income_page.value = res.pagination;

  // 更新 pinia
  store.board_update = !store.board_update;
}

const processData = (list) => list.map((item) => ({...item, date: dayjs(item.date).format("YYYY-MM-DD")}));


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

// 重置
const handleIncomeResize = async () => {
  incomeFormSearch.value = {
    type: '',
    startTime: '',
    endTime: ''
  }
  incomeFormDate.value = []
  await getIncomeList()
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

.type_box {
  display: flex;
  align-items: center;
  justify-content: center;

  .type_dot {
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 10px;
    margin-right: 5px;
  }
}

</style>
