<template>
  <div class="app-loading" v-show="msg.show">
    <div class="app-loading-wrap">
      <div class="app-loading-dots">
        <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
      </div>
      <div class="app-loading-title">
        {{ msg.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {getTheme} from "@/utils/index.js";

const loadingBg = ref('')
const loadingTitleColor = ref('')


if (getTheme() === 'dark') {
  loadingBg.value = 'rgba(52,52,54,0.8)'
  loadingTitleColor.value = 'rgb(255 255 255 / 85%)'
} else {
  loadingBg.value = 'rgba(255, 255, 255, 0.8)'
  loadingTitleColor.value = '#6B5DD3'
}

const props = defineProps({
  msg: {
    type: Object,
    required: true
  }
})

</script>

<style scoped>
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: v-bind(loadingBg);
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.app-loading .app-loading-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  transform: translate3d(-50%, -50%, 0);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.app-loading .app-loading-title {
  display: flex;
  margin-top: 30px;
  font-size: 18px;
  color: v-bind(loadingTitleColor);
  justify-content: center;
  align-items: center;
}

.dot {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 48px;
  margin-top: 30px;
  font-size: 32px;
  transform: rotate(45deg);
  box-sizing: border-box;
  animation: antRotate 1.2s infinite linear;
}

.dot i {
  position: absolute;
  display: block;
  width: 20px;
  height: 20px;
  background: #6B5DD3;
  border-radius: 100%;
  opacity: 30%;
  transform: scale(0.75);
  animation: antSpinMove 1s infinite linear alternate;
  transform-origin: 50% 50%;
}

.dot i:nth-child(1) {
  top: 0;
  left: 0;
}

.dot i:nth-child(2) {
  top: 0;
  right: 0;
  animation-delay: 0.4s;
}

.dot i:nth-child(3) {
  right: 0;
  bottom: 0;
  animation-delay: 0.8s;
}

.dot i:nth-child(4) {
  bottom: 0;
  left: 0;
  animation-delay: 1.2s;
}

@keyframes antRotate {
  to {
    transform: rotate(405deg);
  }
}

@keyframes antSpinMove {
  to {
    opacity: 100%;
  }
}
</style>
