<template>
  <el-dialog
      :model-value="visible"
      :title="dialogTitle"
      width="40%"
      draggable
      @close="dialogShow"
      destroy-on-close
      align-center>
    <el-form
        :model="lendFormDialogData"
        ref="lendFormRef"
        :rules="lendRules"
        label-width="80"
        label-position="left">
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
        <el-input :prefix-icon="Money" v-model="lendFormDialogData.amount" style="width: 100%" clearable
                  placeholder="请输入金额"/>
      </el-form-item>
      <el-form-item label="利息(¥)" prop="interest">
        <el-input :prefix-icon="Money" v-model="lendFormDialogData.interest" style="width: 100%" clearable
                  placeholder="请输入利息"/>
      </el-form-item>
      <el-form-item label="凭证" prop="voucher">
        <upload-img
            tips="上传凭证"
            v-model:file="lendFormDialogData.voucher"
        />
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
            maxlength="100"
            show-word-limit
            v-model="lendFormDialogData.reason" placeholder="请输入原因"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
            type="textarea"
            maxlength="100"
            show-word-limit
            v-model="lendFormDialogData.remark" clearable placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleLendFormResize()">重 置</el-button>
        <el-button
            type="primary"
            @click="handleLendFormDialogSubmit(lendFormRef)">
          提 交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ElConfigProvider, ElMessage} from 'element-plus'
import {Money} from "@element-plus/icons-vue";
import {ref, watch} from "vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {addLendInfo, editLendInfo} from "@/api/lend";
import dayjs from "dayjs";
import {shortcuts} from "@/utils";
import UploadImg from "@/components/upload-img/upload-img.vue";

const locale = ref(zhCn)

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    require: true,
  },
  type: {
    type: String,
    default: 'add',
    require: true,
  },
  data: {
    type: Object,
    require: true,
  },
  lendPersonId: {
    type: Number,
    require: true,
  },
})

// 表单的显示和隐藏
const emit = defineEmits(['update:visible'])
const dialogShow = () => {
  emit('update:visible', false)
}

// 标题
const dialogTitle = ref('')

const lendFormRef = ref(null)

// 表单数据
const lendFormDialogData = ref({
  lendPersonId: props.lendPersonId,
  id: null, // 编辑时需要
  date: '',
  repaymentDate: '',
  amount: null,
  interest: null,
  reason: '',
  type: 1,
  voucher: null,
  settle: 0,
  remark: '',
})

// 表单时间
const lendFormDialogDate = ref([])

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
    {required: true, message: '请上传凭证', trigger: 'change'}
  ],
  settle: [
    {required: true, message: '请选择结清', trigger: 'change'}
  ],
  remark: [
    {max: 100, message: '不能超过 100 个字符', trigger: 'change'}
  ]
})

// 处理数据
const initData = () => {
  dialogTitle.value = props.type === 'add' ? '新增借款记录' : '编辑借款记录'
  if (props.type === 'add') {
    handleLendFormResize()
  } else {
    let formatDate = [dayjs(props.data.date).format('YYYY-MM-DD')]
    let formatRepaymentDate = [dayjs(props.data.repaymentDate).format('YYYY-MM-DD')]
    lendFormDialogData.value = {
      ...props.data,
      date: formatDate,
      repaymentDate: formatRepaymentDate,
      type: props.data.type === '一次性还' ? 1 : 0,
      settle: props.data.settle === '已结清' ? 1 : 0,
    }
    lendFormDialogDate.value = [formatDate, formatRepaymentDate]
  }
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
      if (props.type === 'add') {
        try {
          await addLendInfo(params)
          ElMessage.success('数据提交成功')
        } catch (e) {

        }
      } else {
        try {
          await editLendInfo(params)
          ElMessage.success('数据修改成功')
        } catch (e) {

        }
      }
      handleLendFormResize()
      dialogShow()
    } else {
      console.log(fields);
      ElMessage.error('请检查表单数据的完整性')
      return false
    }
  })
}

// 重置表单
const handleLendFormResize = () => {
  lendFormDialogDate.value = []
  lendFormDialogData.value = {
    LendPersonId: null,
    date: '',
    repaymentDate: '',
    amount: null,
    interest: null,
    reason: '',
    type: 1,
    voucher: null,
    settle: 0,
    remark: ''
  }
}

watch(
    () => ({
      data: props.data
    }),
    async (newVal, oldVal) => {
      if (newVal.data !== oldVal.data) {
        initData()
      }
    }
)

</script>
