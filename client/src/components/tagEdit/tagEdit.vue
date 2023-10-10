<template>
  <div class="tag-and-category">
    <el-card shadow="hover">
      <template #header>
        <p class="tag-title">{{ title }}</p>
      </template>
      <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          size="large"
      >
        <div class="tag-box">
          <span class="tag-text">{{ tag.tag }}</span>
          <el-icon @click="handleEdit(tag)">
            <Edit/>
          </el-icon>
          <el-popconfirm title="确定删除吗?" @confirm="handleClose(tag)">
            <template #reference>
              <el-icon>
                <CircleClose/>
              </el-icon>
            </template>
          </el-popconfirm>
        </div>
      </el-tag>
      <el-input
          style="width: 130px;"
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          placeholder="请输入标签名"
      />
      <el-button v-else size="small" @click="showInput" style="padding: 15px">
        + 添加{{ type === 1 ? '标签' : '分类' }}
      </el-button>
    </el-card>
    <el-dialog
        v-model="editDialogVisible"
        title="编辑内容"
        width="30%"
        @submit.native.prevent
        destroy-on-close
    >
      <el-form :model="editDialog">
        <el-form-item label="名称" :label-width="60">
          <el-input
              v-auto-focus
              v-model="editDialog.tag"
              autocomplete="off"
              placeholder="请输入名称"
              @keydown.enter.native="handleEditConfirm"
          />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {nextTick, ref} from 'vue'
import {addNoteTagInfo, deleteNoteTagInfo, editNoteTagInfo, getNoteTagInfo} from '@/api/noteLabelsAndCategory'
import {ElMessage} from "element-plus";

const props = defineProps({
  type: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ''
  }
})

const inputValue = ref('')
const dynamicTags = ref([])
const inputVisible = ref(false)
const InputRef = ref(null)
const editDialogVisible = ref(false)
const editDialog = ref({
  id: '',
  tag: ''
})

// 关闭标签
const handleClose = async ({id}) => {
  try {
    await deleteNoteTagInfo({
      id,
      type: props.type
    })
    ElMessage.success('删除成功')
    await getTagAllData()
  } catch (e) {
  }
}

// 编辑标签
const handleEdit = async ({id, tag, type}) => {
  editDialogVisible.value = true
  editDialog.value = {
    id,
    tag,
    type,
  }
}

const handleEditConfirm = async () => {
  try {
    await editNoteTagInfo({
      ...editDialog.value
    })
    ElMessage.success('编辑成功')
    await getTagAllData()
    editDialogVisible.value = false
  } catch (e) {

  }
}

// 显示输入框并聚焦
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}

// 添加标签
const handleInputConfirm = async () => {
  if (inputValue.value) {
    try {
      await addNoteTagInfo({
        tag: inputValue.value,
        type: props.type
      })
      ElMessage.success('添加成功')
      await getTagAllData()
    } catch (err) {
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}
const getTagAllData = async () => {
  const {list} = await getNoteTagInfo({
    type: props.type
  })
  dynamicTags.value = list
}

onMounted(() => {
  getTagAllData()
})

</script>

<style scoped lang="scss">
.tag-and-category {
  .el-card {
    margin-bottom: 10px;

    .tag-title {
      font-size: 16px;
      color: var(--el-text-color-regular);
    }

    .el-tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }

    .tag-box {
      display: flex;
      align-items: center;

      .tag-text {
        margin-right: 5px;
      }
    }
  }
}
</style>
