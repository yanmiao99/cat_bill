<template>
  <el-dialog
      :model-value="visible"
      :title="dialogTitle"
      @close="dialogShow"
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
                    @click="handleLendFormRemove()">
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
        <el-button @click="handleLendFormResize(lendFormRef)">重 置</el-button>
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
import {Delete, UploadFilled} from "@element-plus/icons-vue";
import {nextTick, ref, watch} from "vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {uploadImage} from "@/api/upload";
import {addLendInfo, editLendInfo} from "@/api/lend";
import dayjs from "dayjs";
import {shortcuts} from "@/utils";

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

// 标题
const dialogTitle = ref('')

// 表单数据
const lendFormDialogData = ref({
  lendPersonId: props.lendPersonId,
  id: null, // 编辑时需要
  date: '',
  repaymentDate: '',
  amount: 0,
  interest: 0,
  reason: '',
  type: 1,
  voucher: '',
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

// 弹窗表单
const lendFormRef = ref(null)

// 图片上传的列表
const lendFileList = ref([])

// 设置图片上传显示和隐藏
const setFileListShow = (show) => {
  nextTick(() => {
    let card = document.querySelector('.el-upload--picture-card')
    card.style.display = show ? 'inline-flex' : 'none'
  })
}

// 处理图片移除
const handleLendFormRemove = () => {
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

// 处理数据
const initData = () => {
  dialogTitle.value = props.type === 'add' ? '新增借款记录' : '编辑借款记录'
  if (props.type === 'add') {
    handleLendFormResize(lendFormRef.value)
  } else {
    let formatDate = [dayjs(props.data.date).format('YYYY-MM-DD')]
    let formatRepaymentDate = [dayjs(props.data.repaymentDate).format('YYYY-MM-DD')]
    lendFormDialogData.value = {
      ...props.data,
      date: formatDate,
      repaymentDate: formatRepaymentDate,
      type: props.data.type === '一次性还' ? 1 : 0,
      settle: props.data.settle === '已结清' ? 1 : 0
    }
    lendFormDialogDate.value = [formatDate, formatRepaymentDate]
    lendFileList.value = [{
      name: '编辑回显的图片',
      url: props.data.voucher
    }]
    setFileListShow(false)
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
        await addLendInfo(params)
        ElMessage.success('数据提交成功')
      } else {
        await editLendInfo(params)
        ElMessage.success('数据修改成功')
      }
      handleLendFormResize(formEl)
      dialogShow()
    } else {
      console.log(fields);
      ElMessage.error('请检查表单数据')
      return false
    }
  })
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


</script>
