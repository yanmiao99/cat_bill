<template>
  <div class="lend">
    <div class="land_header">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.borrower" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLendPeopleAddOrEdit('add',{})">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
        :data="lendPeopleData"
        stripe
        border
        :summary-method="formatStatistics"
        empty-text="暂无数据"
        show-summary
        sum-text="合计">
      <el-table-column align="center" label="序号" type="index" width="70"/>
      <el-table-column align="center" label="姓名" prop="borrower" sortable/>
      <el-table-column align="center" label="总金额(¥)" prop="totalAmount" sortable/>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button-group>
            <el-button plain type="warning" :icon="Edit" @click="handleLendPeopleAddOrEdit('edit',scope.row)"/>
            <el-button plain type="success" :icon="View" @click="handleLendPeopleView(scope.row)"/>
            <el-popconfirm title="你确定删除该条数据吗?" @confirm="handleLendPeopleDelete(scope.row)">
              <template #reference>
                <el-button plain type="danger" :icon="Delete"/>
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="land_footer">
      <el-pagination
          background
          layout="prev, pager, next"
          v-model:page-size="lendPeople_page.limit"
          v-model:current-page="lendPeople_page.page"
          :total="lendPeople_page.totalCount"
      />
    </div>
    <el-drawer
        v-model="drawerDialogVisible"
        direction="ltr"
        size="80%">
      <template #header>
        <span>{{ drawerDialogTitle }}</span>
        <el-button type="primary">新增</el-button>
      </template>
      <el-table
          :data="lendData"
          stripe
          border
          :summary-method="formatStatistics"
          empty-text="暂无数据"
          show-summary
          sum-text="合计">
        <el-table-column align="center" label="ID" prop="id" width="70"/>
        <el-table-column align="center" label="借款日期" prop="date" sortable/>
        <el-table-column align="center" label="还款日期" prop="repaymentDate" sortable/>
        <el-table-column align="center" label="金额(¥)" prop="amount" sortable/>
        <el-table-column align="center" label="利息(¥)" prop="interest" sortable/>
        <el-table-column align="center" label="原因" :show-overflow-tooltip="true" prop="reason"/>
        <el-table-column align="center" label="还款方式" prop="type">
          <template #default="scope">
            <el-tag v-if="scope.row.type === '一次性还'" type="success">{{ scope.row.type }}</el-tag>
            <el-tag v-else type="warning">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="凭证" prop="voucher">
          <template #default="scope">
            <el-image
                style="width: 50px; height: 50px;border-radius: 5px;"
                :src="scope.row.voucher"
                hide-on-click-modal
                :preview-src-list="[scope.row.voucher]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结清" prop="settle">
          <template #default="scope">
            <el-tag v-if="scope.row.settle === '已结清'" type="success">{{ scope.row.settle }}</el-tag>
            <el-tag v-else type="warning">{{ scope.row.settle }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" :show-overflow-tooltip="true" prop="remark"/>
        <el-table-column align="center" label="操作" width="130">
          <template #default="scope">
            <el-button-group>
              <el-button plain type="success" :icon="Edit"/>
              <el-button plain type="danger" :icon="Delete"/>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination
            background
            layout="prev, pager, next"
            hide-on-single-page
            style="float: right;margin-top: 10px"
            v-model:page-size="lend_page.limit"
            v-model:current-page="lend_page.page"
            :total="lend_page.totalCount"
        />
      </template>
    </el-drawer>

    <el-dialog v-model="dialogLendPeopleFormVisible"
               width="30%"
               :title="`${LendPeopleType === 'add' ? '新增' : '编辑'}借款人信息`">
      <el-form :model="lendPeopleForm">
        <el-form-item label="借款人名称" :label-width="100">
          <el-input v-model="lendPeopleForm.borrower"
                    placeholder="请输入借款人名称"
                    autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogLendPeopleFormSubmit">
          提交
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import {
  addLendPeopleInfo,
  getLendPeopleInfo,
  getSearchLendPeople,
  updateLendPeopleInfo,
  deleteLendPeopleInfo
} from '../api/lendPeople'
import {getLendInfo} from "../api/lend";
import dayjs from 'dayjs'
import {Delete, Edit, View} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus'

onMounted(() => {
  getLendPeople()
})

// 格式化统计信息
const formatStatistics = (param) => {
  const {columns, data} = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `¥ ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })

  return sums
}

// 借款人信息
const lendPeopleData = ref([]);
// 借款人分页
const lendPeople_page = ref({
  page: 1, // 当前页数，即请求中传入的page参数。
  limit: 9, // 每页返回的数据量，即请求中传入的limit参数。
  totalCount: 0, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
})
// 获取借款人信息
const getLendPeople = async () => {
  const borrowerRes = await getLendPeopleInfo({
    page: lendPeople_page.value.page,
    limit: lendPeople_page.value.limit
  })
  lendPeopleData.value = borrowerRes.list
  lendPeople_page.value = borrowerRes.pagination
}
// 当前借款人id
const currentLendPersonId = ref(0)
// 借款人详情的弹窗
const drawerDialogVisible = ref(false)
// 借款人详情的弹窗标题
const drawerDialogTitle = ref('')
// 查看借款人详情信息
const handleLendPeopleView = (item) => {
  getLendData(item.id)
  currentLendPersonId.value = item.id
  drawerDialogVisible.value = true
  drawerDialogTitle.value = item.borrower + '的借款记录'
}

// 借款记录分页
const lend_page = ref({
  page: 1,
  limit: 7,
  totalCount: 0,
})
// 借款记录数据
const lendData = ref([])

// 获取借款记录
const getLendData = async (id) => {
  const res = await getLendInfo({
    LendPersonId: id,
    page: lend_page.value.page,
    limit: lend_page.value.limit
  })

  res.list.forEach(item => {
    item.date = dayjs(item.date).format('YYYY-MM-DD')
    item.repaymentDate = dayjs(item.repaymentDate).format('YYYY-MM-DD')
    item.type = item.type === 1 ? '一次性还' : '分期还'
    item.settle = item.settle === 1 ? '已结清' : '未结清'
  })

  lendData.value = res.list
  lend_page.value = res.pagination
}

// 搜索借款人
const searchForm = ref({
  borrower: '',
})

// 搜索借款人方法
const handleSearch = async () => {
  let res = await getSearchLendPeople({
    borrower: searchForm.value.borrower,
    page: lendPeople_page.value.page,
    limit: lendPeople_page.value.limit
  })
  lendPeopleData.value = res.list
  lendPeople_page.value = res.pagination
}

const dialogLendPeopleFormVisible = ref(false)
const lendPeopleForm = ref({
  borrower: '',
})

const LendPeopleType = ref('add')
const LendPeopleItem = ref({})

// 添加/编辑借款人
const handleLendPeopleAddOrEdit = async (type, item) => {
  dialogLendPeopleFormVisible.value = true
  LendPeopleType.value = type
  LendPeopleItem.value = item
  if (type === 'add') {
    lendPeopleForm.value.borrower = ''
  } else {
    lendPeopleForm.value.borrower = item.borrower
  }
}

const dialogLendPeopleFormSubmit = async () => {
  if (LendPeopleType.value === 'add') {
    await addLendPeopleInfo({
      borrower: lendPeopleForm.value.borrower,
    })
  } else {
    await updateLendPeopleInfo({
      id: LendPeopleItem.value.id,
      borrower: lendPeopleForm.value.borrower,
    })
  }

  ElMessage.success('操作成功')
  await getLendPeople()
  dialogLendPeopleFormVisible.value = false
}

// 删除借款人
const handleLendPeopleDelete = async (item) => {
  await deleteLendPeopleInfo({
    id: item.id
  })
  ElMessage.success('删除成功')
  await getLendPeople()
}

// 监听分页
watch(
    () => ({
      card_page: lendPeople_page.value.page,
      table_page: lend_page.value.page,
    }),
    async (newVal, oldVal) => {
      if (newVal.card_page !== oldVal.card_page) {
        await getLendPeople()
      } else if (newVal.table_page !== oldVal.table_page) {
        await getLendData(currentLendPersonId.value)
      }
    }
)

</script>

<style scoped lang="scss">

.lend {

  .land_header {
    background: #fff;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    margin-bottom: 10px;

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .land_footer {
    width: 100%;
    background: #fff;
    padding: 10px 20px;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #ddd;
  }

  // 用于解决遮罩层被表格遮挡的 bug
  :deep(.el-table .el-table__cell) {
    position: unset !important;
  }
}

</style>
