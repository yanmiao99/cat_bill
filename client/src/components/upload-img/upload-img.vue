<template>
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
      <p>{{ tips }}</p>
    </div>
    <template #file="{ file }">
      <div>
        <img
            v-if="lendFileList.length > 0"
            class="el-upload-list__item-thumbnail"
            :src="lendFileList[0].url"
            alt="预览图"/>
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
</template>

<script setup>
import {defineProps, defineEmits, nextTick, ref, watch} from 'vue'
import {Delete, UploadFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {uploadImage} from "@/api/upload";

const props = defineProps({
  tips: {     // 提示文字
    type: String,
    default: '点击上传图片'
  },
  file: {     // 上传的文件
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:file'])

// 设置图片上传显示和隐藏
const setFileListShow = (show) => {
  nextTick(() => {
    let card = document.querySelector('.el-upload--picture-card')
    card.style.display = show ? 'inline-flex' : 'none'
  })
}

// 图片上传的列表
const lendFileList = ref([])

if (props.file) {
  lendFileList.value = [{
    name: '编辑回显的图片',
    url: props.file
  }]
  setFileListShow(false)
}

// 处理图片移除
const handleLendFormRemove = () => {
  lendFileList.value = []
  emit('update:file', '')
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
  emit('update:file', res.url)
  if (lendFileList.value.length > 0) {
    setFileListShow(false)
  }
}

</script>
