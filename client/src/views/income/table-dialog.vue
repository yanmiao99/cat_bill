<template>
  <el-dialog
      :model-value="visible"
      :title="dialogTitle"
      @close="dialogShow"
      width="30%"
      draggable
      align-center>
    <el-form
        :model="incomeFormData"
        ref="incomeFormRef"
        :rules="incomeRules"
        label-width="80"
        label-position="left">
      <el-form-item label="日期" style="width: 100%" required>
        <ElConfigProvider :locale="locale">
          <el-date-picker
              v-model="incomeFormData.date"
              type="date"
              clearable
              placeholder="请选择日期"
          />
        </ElConfigProvider>
      </el-form-item>
      <el-form-item label="金额(¥)" prop="amount">
        <el-input :prefix-icon="Money" v-model="incomeFormData.amount" style="width: 100%" clearable
                  placeholder="请输入金额"/>
      </el-form-item>
      <el-form-item label="收入类型" prop="type">
        <el-radio-group v-model="incomeFormData.type">
          <el-radio label="工资" border>工资</el-radio>
          <el-radio label="私单" border>私单</el-radio>
          <el-radio label="其他" border>其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否入账" prop="isReceived">
        <el-select v-model="incomeFormData.isReceived" placeholder="请选择是否入账" style="width: 100%">
          <el-option label="未到账" :value="0"/>
          <el-option label="已到账" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
            type="textarea"
            maxlength="100"
            show-word-limit
            @keydown.enter="handleIncomeFormDialogSubmit(incomeFormRef)"
            v-model="incomeFormData.remark" clearable placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleIncomeFormResize(incomeFormRef)">重 置</el-button>
        <el-button
            type="primary"
            @click="handleIncomeFormDialogSubmit(incomeFormRef)">
          提 交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, watch} from "vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import dayjs from "dayjs";
import {addIncomeListInfo, editIncomeListInfo} from "@/api/incomeList";
import {ElMessage} from "element-plus";
import {Money} from "@element-plus/icons-vue";

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
  }
})

// 表单的显示和隐藏
const emit = defineEmits(['update:visible'])
const dialogShow = () => {
  emit('update:visible', false)
}

watch(
    () => ({
      data: props.data
    }),
    async (newVal, oldVal) => {
      if (newVal.data !== oldVal.data) {
        initIncomeFormData()
      }
    }
)

// 表单验证规则
const incomeRules = ref({
  date: [
    {required: true, message: '请选择日期', trigger: 'change'}
  ],
  amount: [
    {required: true, message: '请输入金额', trigger: 'change'}
  ],
  type: [
    {required: true, message: '请选择收入类型', trigger: 'change'}
  ],
  isReceived: [
    {required: true, message: '请选择是否已收到', trigger: 'change'}
  ],
  remark: [
    {required: true, message: '请输入备注', trigger: 'change'},
    {max: 100, message: '不能超过 100 个字符', trigger: 'change'}
  ]
})

// 标题
const dialogTitle = ref('')

// 表单的数据
const incomeFormData = ref({
  id: null,
  date: '',
  type: '其他',
  amount: null,
  isReceived: 1,
  remark: '',
})

// 获取表单
const incomeFormRef = ref(null)

// 格式化表单数据
const initIncomeFormData = () => {
  dialogTitle.value = props.type === 'add' ? '新增收入记录' : '编辑收入记录'
  if (props.type === 'add') {
    handleIncomeFormResize(incomeFormRef.value)
    incomeFormData.value.date = dayjs().format('YYYY-MM-DD');
  } else {
    // 编辑
    incomeFormData.value = {
      ...props.data,
      amount: Number(props.data.amount)
    }
  }
}


// 表单的重置
const handleIncomeFormResize = (formRef) => {
  if (!formRef) return
  incomeFormData.value = {
    id: null,
    date: '',
    type: '其他',
    amount: null,
    isReceived: 1,
    remark: '',
  }
  formRef.resetFields()
}

// 表单的提交
const handleIncomeFormDialogSubmit = (formRef) => {
  if (!formRef) return
  formRef.validate(async (valid, fields) => {
    if (valid) {
      let params = {
        ...incomeFormData.value
      }
      console.log(params);
      if (props.type === 'add') {
        // 新增
        try {
          await addIncomeListInfo(params)
          ElMessage.success('数据提交成功')
        } catch (e) {

        }
      } else {
        // 编辑
        try {
          await editIncomeListInfo(params)
          ElMessage.success('数据修改成功')
        } catch (e) {

        }
      }
      handleIncomeFormResize(formRef)
      dialogShow()
    } else {
      console.log(fields);
      ElMessage.error('请检查表单数据')
      return false
    }
  })
}


</script>

<style scoped lang="scss">

:deep(.el-input) {
  width: 100%;

  .el-input__wrapper {
    width: 100%;
    box-sizing: border-box;
  }
}

</style>
