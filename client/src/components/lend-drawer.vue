<template>
  <el-drawer
      :model-value="visible"
      direction="ltr"
      @close="dialogShow"
      size="80%">
    <template #header>
      <span>{{ title }}</span>
      <el-button type="primary" @click="handleLendAddAndEdit('add',{})">新增</el-button>
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
          <el-image
              style="width: 50px; height: 50px;border-radius: 5px;"
              :src="scope.row.voucher"
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
      <el-table-column align="center" label="操作" width="130">
        <template #default="scope">
          <el-button-group>
            <el-button plain type="success" :icon="Edit" @click="handleLendAddAndEdit('edit',scope.row)"/>
            <el-popconfirm title="你确定删除该条数据吗?" @confirm="handleLendDelete(scope.row)">
              <template #reference>
                <el-button plain type="danger" :icon="Delete"/>
              </template>
            </el-popconfirm>
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
  <el-dialog v-model="lendFormDialogVisible" :title="lendFormDialogTitle" align-center>
    <el-form :model="lendFormDialogData" ref="lendFormRef" :rules="lendRules" label-width="80" label-position="left">
      <el-form-item label="日期" style="width: 100%" required>
        <ElConfigProvider :locale="locale">
          <el-date-picker
              v-model="lendFormDialogDate"
              type="daterange"
              range-separator="至"
              start-placeholder="借款日期"
              end-placeholder="还款日期"
              :shortcuts="shortcuts"
          />
        </ElConfigProvider>
      </el-form-item>
      <el-form-item label="金额(¥)" prop="amount">
        <el-input-number
            v-model="lendFormDialogData.amount"
            style="width: 100%"
            clearable
            :precision="2" :step="0.1" :max="99999"
            placeholder="请输入金额" controls-position="right" :value-on-clear="0"/>
      </el-form-item>
      <el-form-item label="利息(¥)" prop="interest">
        <el-input-number
            v-model="lendFormDialogData.interest"
            style="width: 100%"
            clearable
            :precision="2" :step="0.1" :max="99999"
            placeholder="请输入利息" controls-position="right" :value-on-clear="0"/>
      </el-form-item>
      <el-form-item label="凭证" prop="voucher">
        <el-upload
            action=""
            :auto-upload="true"
            :limit="1"
            :http-request="handleUploadFile"
            :before-upload="handleLendFormBeforeUpload"
            v-model:file-list="lendFileList"
            list-type="picture-card"
            accept=".jpg,.jpeg,.png,JPG,JPEG,PNG"
        >
          <div class="el-upload__text" style="text-align: center">
            <el-icon>
              <upload-filled/>
            </el-icon>
            <p>上传凭证</p>
          </div>
          <template #file="{ file }">
            <div>
              <img
                  v-if="lendFormDialogData.voucher"
                  class="el-upload-list__item-thumbnail"
                  :src="lendFormDialogData.voucher"
                  alt=""/>
              <div class="el-upload-list__item-actions">
                <span
                    class="el-upload-list__item-delete"
                    @click="handleLendFormRemove(file)">
                  <el-icon>
                    <Delete/>
                  </el-icon>
                </span>
              </div>
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="还款方式" prop="type">
        <el-select v-model="lendFormDialogData.type" placeholder="请选择还款方式" style="width: 100%">
          <el-option label="一次性还" :value="1"/>
          <el-option label="分期还" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="结清" prop="settle">
        <el-select v-model="lendFormDialogData.settle" placeholder="请选择结清" style="width: 100%">
          <el-option label="已结清" :value="1"/>
          <el-option label="未结清" :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="reason">
        <el-input
            type="textarea"
            v-model="lendFormDialogData.reason" placeholder="请输入原因"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
            type="textarea"
            v-model="lendFormDialogData.remark" clearable placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleLendFormResize(lendFormRef)">重 置</el-button>
        <el-button
            type="primary"
            :disabled="submitDisabled"
            @click="handleLendFormDialogSubmit(lendFormRef)">
          提 交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, watch} from "vue";
import {addLendInfo, deleteLendInfo, editLendInfo, getLendInfo} from "../api/lend";
import dayjs from "dayjs";
import {formatStatistics} from "../utils";
import {Delete, Edit, UploadFilled} from "@element-plus/icons-vue";
import {ElConfigProvider, ElMessage} from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {uploadImage} from "../api/upload";

const locale = ref(zhCn)

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

// 表单校验
const lendRules = ref({
  date: [
    {required: true, message: '请选择日期', trigger: 'change'}
  ],
  repaymentDate: [
    {required: true, message: '请选择还款日期', trigger: 'change'}
  ],
  amount: [
    {required: true, message: '请输入金额', trigger: 'change'}
  ],
  interest: [
    {required: true, message: '请输入利息', trigger: 'change'}
  ],
  reason: [
    {required: true, message: '请输入原因', trigger: 'change'},
    {max: 100, message: '不能超过 100 个字符', trigger: 'change'}
  ],
  type: [
    {required: true, message: '请选择还款方式', trigger: 'change'}
  ],
  voucher: [
    {required: true, message: '请输入凭证', trigger: 'change'}
  ],
  settle: [
    {required: true, message: '请选择结清', trigger: 'change'}
  ],
  remark: [
    {max: 100, message: '不能超过 100 个字符', trigger: 'change'}
  ]
})

// 弹窗类型
const lendType = ref('add')
// 点击后,获取到行的数据
const lendClickItem = ref({})
// 弹窗相关 1.弹窗是否显示 2.弹窗标题 3.弹窗日期 4.弹窗数据
const lendFormDialogVisible = ref(false)
const lendFormDialogTitle = ref('')
const lendFormDialogDate = ref([])
const lendFormDialogData = ref({
  LendPersonId: null,
  date: '',
  repaymentDate: '',
  amount: 0,
  interest: 0,
  reason: '',
  type: 1,
  voucher: '',
  settle: 0,
  remark: ''
})

// 弹窗表单
const lendFormRef = ref(null)

const lendFileList = ref([])

const setFileListShow = (show)=>{
  let card = document.querySelector('.el-upload--picture-card')
  card.style.display = show ? 'inline-flex' : 'none'
}

const handleLendFormRemove = (file) => {
  lendFileList.value = []
  lendFormDialogData.value.voucher = ''
  if (lendFileList.value.length === 0) {
    setFileListShow(true)
  }
}

// 图片上传处理钩子
const handleLendFormBeforeUpload = (file) => {
  const isPng = /image\/png/.test(file.type);
  const isJpg = /image\/jpeg|image\/jpg/.test(file.type);
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isPng && !isJpg) {
    ElMessage.error('只能上传 PNG 或 JPG 格式的图片！');
  }

  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB！');
  }

  return (isPng || isJpg) && isLt2M;
}


// 图片上传
const handleUploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file.file)
  let res = await uploadImage(formData)
  lendFormDialogData.value.voucher = res.url

  if (lendFileList.value.length > 0) {
    setFileListShow(false)
  }
}

const submitDisabled = ref(false)

// 新增或者编辑按钮
const handleLendAddAndEdit = (type, item) => {
  if (type === 'add') {
    lendFormDialogTitle.value = '新增借款记录'
    handleLendFormResize(lendFormRef.value)
  } else {
    lendFormDialogTitle.value = '编辑借款记录'
    let formatDate = [dayjs(item.date).format('YYYY-MM-DD')]
    let formatRepaymentDate = [dayjs(item.repaymentDate).format('YYYY-MM-DD')]
    lendFormDialogData.value = {
      ...item,
      date: formatDate,
      repaymentDate: formatRepaymentDate
    }
    lendFormDialogDate.value = [formatDate, formatRepaymentDate]
  }
  lendType.value = type
  lendClickItem.value = item
  lendFormDialogVisible.value = true
}

// 新增或者编辑表单提交
const handleLendFormDialogSubmit = async (formEl) => {
  let params = {
    ...lendFormDialogData.value,
    date: lendFormDialogDate.value[0],
    repaymentDate: lendFormDialogDate.value[1],
    LendPersonId: props.lendPersonId
  }

  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (lendType.value === 'add') {
        await addLendInfo(params)
        ElMessage.success('数据提交成功')
      } else {
        // console.log(params);
        params.id = lendClickItem.value.id
        params.type = lendFormDialogData.value.type === '一次性还' ? 1 : 0
        params.settle = lendFormDialogData.value.settle === '已结清' ? 1 : 0
        await editLendInfo(params)
        ElMessage.success('数据修改成功')
      }
      await getLendData(props.lendPersonId)
      lendFormDialogVisible.value = false
      handleLendFormResize(formEl)
    } else {
      console.log(fields);
      ElMessage.error('请检查表单数据')
      return false
    }
  })
}

// 删除借款记录
const handleLendDelete = async (item) => {
  await deleteLendInfo({
    LendPersonId: props.lendPersonId,
    id: item.id
  })
  ElMessage.success('删除成功')
  await getLendData(props.lendPersonId)
}

// 重置表单
const handleLendFormResize = (formEl) => {
  if (!formEl) return
  lendFormDialogDate.value = []
  lendFileList.value = []
  setFileListShow(true)
  lendFormDialogData.value = {
    LendPersonId: null,
    date: '',
    repaymentDate: '',
    amount: 0,
    interest: 0,
    reason: '',
    type: 1,
    voucher: '',
    settle: 0,
    remark: ''
  }
  formEl.resetFields()
}

// 时间格式化
function getDateRange(startOffset, endOffset) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() + 3600 * 1000 * 24 * startOffset)
  end.setTime(end.getTime() + 3600 * 1000 * 24 * endOffset)
  return [end, start]
}

const shortcuts = [
  {
    text: '往后一周',
    value: () => getDateRange(7, 0),
  },
  {
    text: '往后一月',
    value: () => getDateRange(30, 0),
  },
  {
    text: '往后三月',
    value: () => getDateRange(90, 0),
  },
]

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

<style scoped>
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
