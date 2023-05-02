<template>
  <div ref="chartRef" :style="{ height }" class="charts"/>
</template>

<script setup>
import {
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  nextTick,
  watchEffect,
  ref, watch
} from "vue";

import * as echarts from "echarts";
import {commonStore} from "@/store/common";

const store = commonStore()

let chartsDom = ref(null);

const props = defineProps({
  height: {
    type: String,
    default: "300px",
  },
  options: {
    type: Object,
    default: () => ({})
  },
})
const chartRef = ref(null)
watch(
    () => ({
      darkMode: store.darkMode
    }),
    (newVal, oldVal) => {
      if (newVal.darkMode !== oldVal.darkMode) {
        nextTick(() => {
          disposeCharts()
          initCharts();
        });
      }
    },
    {
      // immediate: true,
      deep: true
    }
)

const initCharts = () => {
  let theme
  if (store.getDarkMode === 'dark') {
    theme = 'dark'
  } else {
    theme = ''
  }

  const myChart = echarts.init(chartRef.value, theme);
  watchEffect(() => {
    myChart.setOption({
      // 透明背景
      backgroundColor: 'rgba(0,0,0,0)',
      ...props.options
    });
  })
  chartsDom.value = myChart
};
//窗口resize事件
const handleChartResize = () => {
  chartsDom.value && chartsDom.value.resize();
};

const disposeCharts = () => {
  if (chartsDom.value) {
    chartsDom.value.dispose()
    chartsDom.value = null
  }
}

onBeforeMount(() => {
  nextTick(() => {
    initCharts();
  });
});

onMounted(() => {
  window.addEventListener("resize", handleChartResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleChartResize);
  disposeCharts()
});

</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
}
</style>