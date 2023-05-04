<template>
  <div class="note-labels-and-category">
    <el-card shadow="hover">
      <template #header>
        <p class="tag-title">笔记标签</p>
      </template>
      <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          size="large"
      >
        <div class="tag-box">
          <span class="tag-text">{{ tag }}</span>
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
        + 添加标签
      </el-button>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑内容" width="30%">
      <el-form :model="editDialog">
        <el-form-item label="名称" :label-width="60">
          <el-input v-model="editDialog.tag" autocomplete="off" placeholder="请输入名称"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {nextTick, ref} from 'vue'

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
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

// 编辑标签
const handleEdit = (tag) => {
  editDialogVisible.value = true
}

// 显示输入框并聚焦
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}

// 输入框失去焦点
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<style scoped lang="scss">
.note-labels-and-category {
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
