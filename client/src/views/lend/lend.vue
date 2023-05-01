<template>
  <div class="lend">
    <div class="header_operation">
      <el-form style="width: 100%" :inline="true" :model="searchForm">
        <el-form-item label="姓名" style="flex: 1">
          <el-input
              v-model="searchForm.borrower"
              clearable
              :prefix-icon="Search"
              style="width:100%"
              @keydown.enter.native="handleSearch"
              placeholder="请输入姓名">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleResize" plain>重置</el-button>
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
        empty-text="暂无数据">
      <el-table-column align="center" label="ID" prop="id" sortable width="70"/>
      <el-table-column align="center" label="姓名" prop="borrower" sortable/>
      <el-table-column align="center" label="总金额(¥)" prop="totalAmount" sortable/>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button plain :icon="View" @click="handleLendPeopleView(scope.row)"/>
          <el-button plain type="primary" :icon="Edit" @click="handleLendPeopleAddOrEdit('edit',scope.row)"/>
          <el-popconfirm title="你确定删除该条数据吗?" @confirm="handleLendPeopleDelete(scope.row)">
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
          v-model:page-size="lendPeople_page.limit"
          v-model:current-page="lendPeople_page.page"
          :total="lendPeople_page.totalCount"
      />
    </div>
    <el-dialog
        v-model="dialogLendPeopleFormVisible"
        width="30%"
        draggable
        destroy-on-close
        :title="`${LendPeopleType === 'add' ? '新增' : '编辑'}借款人信息`">
      <el-form :model="lendPeopleForm">
        <el-form-item label="借款人名称" :label-width="100">
          <el-input
              v-model="lendPeopleForm.borrower"
              clearable
              v-auto-focus
              placeholder="请输入借款人名称"
              @keydown.enter.native="dialogLendPeopleFormSubmit"
          />
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
    <lend-drawer
        :lendPersonId="currentLendPersonId"
        v-model:visible="drawerDialogVisible"
        :title="drawerDialogTitle"
    />
  </div>
</template>

<script setup>
import {onMounted, ref, watch, nextTick} from 'vue'
import {
  addLendPeopleInfo,
  getLendPeopleInfo,
  getSearchLendPeople,
  updateLendPeopleInfo,
  deleteLendPeopleInfo
} from '@/api/lendPeople'
import {Delete, Edit, View, Search} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus'
import LendDrawer from "./lend-drawer.vue";

onMounted(() => {
  getLendPeople()
})

// 在模板中启用 v-auto-focus
// const vAutoFocus = {
//   mounted(el, binding) {
//     nextTick(() => {
//       setTimeout(() => {
//         el.querySelector('input').focus()
//       }, 100)
//     })
//   },
// }

// 借款人信息
const lendPeopleData = ref([]);
// 借款人分页
const lendPeople_page = ref({
  page: 1, // 当前页数，即请求中传入的page参数。
  limit: 10, // 每页返回的数据量，即请求中传入的limit参数。
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
  currentLendPersonId.value = item.id
  drawerDialogVisible.value = true
  drawerDialogTitle.value = item.borrower + '的借款记录'
}
// 搜索借款人
const searchForm = ref({
  borrower: '',
})

// 重置借款人列表
const handleResize = () => {
  searchForm.value.borrower = ''
  getLendPeople()
}

// 搜索借款人方法
const handleSearch = async () => {
  if (searchForm.value.borrower === '') {
    ElMessage.warning('请输入借款人名称')
    return
  }
  let res = await getSearchLendPeople({
    borrower: searchForm.value.borrower,
    page: lendPeople_page.value.page,
    limit: lendPeople_page.value.limit
  })
  lendPeopleData.value = res.list
  lendPeople_page.value = res.pagination
}

// 借款人信息表单
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
  try {
    await deleteLendPeopleInfo({
      id: item.id
    })
    ElMessage.success('删除成功')
    await getLendPeople()
  } catch (e) {

  }

}

// 监听分页
watch(
    () => ({
      card_page: lendPeople_page.value.page,
      drawer_visible: drawerDialogVisible.value
    }),
    async (newVal, oldVal) => {
      if (newVal.card_page !== oldVal.card_page) {
        await getLendPeople()
      }
      // 需要在关闭弹窗的时候, 重新请求一下数据, 以保证数据是最新的
      if (newVal.drawer_visible === false && oldVal.drawer_visible === true) {
        await getLendPeople()
      }
    }
)

</script>

<style scoped lang="scss">
.lend {
  // 用于解决遮罩层被表格遮挡的 bug
  :deep(.el-table .el-table__cell) {
    position: unset !important;
  }
}
</style>
