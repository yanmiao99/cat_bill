<template>
  <div class="basic-dialog">
    <el-dialog
        v-bind="attrs"
        :model-value="modelValue"
        :show-close="false"
        :fullscreen="attrs?.fullscreen ?? isFullscreen"
        :before-close="handleClose"
        draggable
        align-center
        destroy-on-close
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">{{ props.title }}</span>
          <div class="dialog-btn-group">
            <el-tooltip
                v-if="isFullScreenBtn"
                effect="dark"
                :content="isFullScreenBtn ? '全屏' : '退出全屏'"
                placement="top"
            >
              <el-icon @click="handleFullscreen">
                <FullScreen/>
              </el-icon>
            </el-tooltip>

            <el-tooltip
                effect="dark"
                content="关闭"
                placement="top"
            >
              <el-icon @click="handleClose">
                <Close/>
              </el-icon>
            </el-tooltip>
          </div>
        </div>
      </template>
      <div class="content" v-loading="loading">
        <slot></slot>
      </div>
      <template #footer>
        <!-- 如果没有提供其他footer插槽，就使用默认的 -->
        <span v-if="!slots.footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">
            {{ confirmText }}
          </el-button>
          <el-button @click="handleClose">{{ cancelText }}</el-button>
        </span>
        <!-- 使用传入进来的插槽 -->
        <slot v-else name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import {FullScreen, Close} from "@element-plus/icons-vue";
import {useSlots} from "vue";

// 获取插槽
const slots = useSlots();
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    require: true,
  },
  title: {
    type: String,
    default: '基础弹窗',
    require: true,
  },
  hiddenFullBtn: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "确认",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const {attrs} = getCurrentInstance();

const emits = defineEmits([
  'update:modelValue',
  'close',
  'confirm'
])

// 当前是否处于全屏状态
const isFullscreen = ref(false);

// 是否显示全屏效果图标
const isFullScreenBtn = computed(() => {
  if (props.hiddenFullBtn) return false;
  if (attrs?.fullscreen) return false;
  return true;
});

// 开启、关闭全屏效果
const handleFullscreen = () => {
  if (attrs?.fullscreen) return;
  isFullscreen.value = !isFullscreen.value;
};
// 关闭弹窗时向外部发送close事件
const handleClose = () => {
  if (Reflect.has(attrs, "before-close") && typeof attrs["before-close"] === "function") {
    attrs["before-close"]();
  }
  emits("close");
  emits('update:modelValue', false)
};

// 点击确认按钮时向外部发送confirm事件
const handleConfirm = () => {
  emits("confirm");
};

</script>

<style lang="scss" scoped>
.dialog-header {
  border-bottom: 1px solid #eee;
  display: flex;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  margin: 0;


  .dialog-title {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
  }

  .dialog-btn-group {
    display: flex;
    align-items: center;

    i {
      margin-right: 8px;
      font-size: 16px;
      cursor: pointer;
    }

    i:last-child {
      margin-right: 0;
    }
  }
}
</style>
