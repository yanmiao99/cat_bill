<template>
  <div class="lend-drawer">
    <el-drawer
        :model-value="visible"
        direction="ltr"
        @close="dialogShow"
        size="80%">
      <template #header>
        <span>{{ title }}</span>
        <el-button type="primary" @click="handleDialogAddOrEdit('add',{})">新增</el-button>
      </template>
      <el-table
          :data="lendData"
          stripe
          border
          empty-text="暂无数据">
        <el-table-column align="center" label="ID" prop="id" width="70"/>
        <el-table-column align="center" label="借款日期" width="130" prop="date" sortable/>
        <el-table-column align="center" label="还款日期" width="130" prop="repaymentDate" sortable/>
        <el-table-column align="center" label="金额(¥)" prop="amount" sortable/>
        <el-table-column align="center" label="利息(¥)" prop="interest" sortable/>
        <el-table-column align="center" label="原因" :show-overflow-tooltip="true" prop="reason"/>
        <el-table-column align="center" label="还款方式" width="110" prop="type" sortable>
          <template #default="scope">
            <el-tag v-if="scope.row.type === '一次性还'" type="success">{{ scope.row.type }}</el-tag>
            <el-tag v-else type="warning">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="凭证" prop="voucher">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                  style="width: 50px; height: 50px;border-radius: 5px;"
                  :src="scope.row.voucher"
                  :preview-teleported="true"
                  hide-on-click-modal
                  :preview-src-list="[scope.row.voucher]">
                <template #error>
                  <div class="image-slot">
                    <el-icon>
                      <Picture/>
                    </el-icon>
                    加载失败
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结清" prop="settle" sortable>
          <template #default="scope">
            <el-tag v-if="scope.row.settle === '已结清'" type="success">{{ scope.row.settle }}</el-tag>
            <el-tag v-else type="warning">{{ scope.row.settle }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" :show-overflow-tooltip="true" prop="remark">
          <template #default="scope">
            <p v-if="scope.row.remark">{{ scope.row.remark }}</p>
            <p v-else> -- </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="130" fixed="right">
          <template #default="scope">
            <el-button plain type="primary" :icon="Edit" @click="handleDialogAddOrEdit('edit',scope.row)"/>
            <el-popconfirm title="你确定删除该条数据吗?" @confirm="handleLendDelete(scope.row)">
              <template #reference>
                <el-button plain type="danger" :icon="Delete"/>
              </template>
            </el-popconfirm>
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
    <lend-form-dialog
        v-model:visible="lendFormDialogVisible"
        :data="lendFormDialogData"
        :type="lendType"
        :lendPersonId="lendPersonId"
    />
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {deleteLendInfo, getLendInfo} from "@/api/lend";
import dayjs from "dayjs";
import {Delete, Edit} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus'
import LendFormDialog from "./lend-form-dialog.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  title: {
    type: String,
    default: '标题',
  },
  lendPersonId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:visible'])
const dialogShow = () => {
  emit('update:visible', false)
}

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

// 弹窗相关
const lendType = ref('add')
const lendFormDialogVisible = ref(false)
const lendFormDialogData = ref({})

// 打开编辑和新增弹窗
const handleDialogAddOrEdit = (type, row) => {
  lendType.value = type
  lendFormDialogData.value = row
  lendFormDialogVisible.value = true
}

// 删除借款记录
const handleLendDelete = async (item) => {
  try {
    await deleteLendInfo({
      LendPersonId: props.lendPersonId,
      id: item.id
    })
    ElMessage.success('删除成功')
    await getLendData(props.lendPersonId)
  } catch (e) {

  }
}

// 借款记录分页
const lend_page = ref({
  page: 1,
  limit: 6,
  totalCount: 0,
})

// 监听分页 / id
watch(
    () => ({
      table_page: lend_page.value.page,
      props_id: props.lendPersonId,
      dialog_visible: lendFormDialogVisible.value
    }),
    async (newVal, oldVal) => {
      if (newVal.table_page !== oldVal.table_page) {
        await getLendData(props.lendPersonId)
      }
      if (newVal.props_id !== oldVal.props_id) {
        await getLendData(props.lendPersonId)
      }
      // 需要在关闭弹窗的时候, 重新请求一下数据, 以保证数据是最新的
      if (newVal.dialog_visible === false && oldVal.dialog_visible === true) {
        await getLendData(props.lendPersonId)
      }
    }
)

</script>

<style scoped lang="scss">
// 加载失败
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #999;
  font-size: 12px;
  margin-top: 10px;
}

</style>
