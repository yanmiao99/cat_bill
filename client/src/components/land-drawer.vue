<template>
  <el-drawer
      :model-value="visible"
      direction="ltr"
      @close="dialogShow"
      size="80%">
    <template #header>
      <span>{{ title }}</span>
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
</template>

<script setup>
import {ref, watch} from "vue";
import {getLendInfo} from "../api/lend";
import dayjs from "dayjs";
import {formatStatistics} from "../utils";
import {Delete, Edit} from "@element-plus/icons-vue";

const props = defineProps(
    {
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
    }
)

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

// 借款记录分页
const lend_page = ref({
  page: 1,
  limit: 6,
  totalCount: 0,
})

// 监听分页
watch(
    () => ({
      table_page: lend_page.value.page,
      props_id: props.lendPersonId
    }),
    async (newVal, oldVal) => {
      if (newVal.table_page !== oldVal.table_page) {
        await getLendData(props.lendPersonId)
      }
      if (newVal.props_id !== oldVal.props_id) {
        await getLendData(props.lendPersonId)
      }

    }
)

</script>

<style scoped lang="scss">
</style>
