<template>
  <template v-for="menu in routerMenu">
    <el-sub-menu
        v-if="menu.children && menu.children.length"
        :key="menu.name"
        :index="menu.path"
    >
      <template #title>
        <el-icon v-if="menu.icon">
          <component :is="menu.icon"/>
        </el-icon>
        <span v-cloak>{{ menu.meta?.title }}</span>
      </template>
      <TreeMenu :routerMenu="menu.children"/>
    </el-sub-menu>
    <el-menu-item
        v-else
        :index="menu.path"
        :key="menu.name">
      <el-icon v-if="menu.icon">
        <component :is="menu.icon"/>
      </el-icon>
      <template #title>
        <span v-cloak>{{ menu.meta?.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>


<script setup>
defineProps({
  routerMenu: {
    type: Array,
    default() {
      return [];
    }
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
})


</script>

<style scoped lang="scss">
.el-menu-item {
  width: v-bind("isCollapse ? '100%' : '90%'");
  margin: 0 auto;
  transition: all 0.3s;

  span {
    opacity: v-bind("isCollapse ? '0' : '1'");
  }

  &:hover {
    background-color: transparent;
    color: var(--el-color-primary);
  }

  &.is-active {
    background-color: var(--el-color-primary-light-9);
    border-radius: 10px;
  }
}

.el-sub-menu {
  width: v-bind("isCollapse ? '100%' : '90%'");
  margin: 0 auto;
  transition: all 0.3s;
  background: transparent;

  :deep(.el-sub-menu__title) {
    &:hover {
      background: transparent !important;
      color: var(--el-color-primary);
    }
  }
}

.is-active {
  :deep(.el-sub-menu__title) {
    position: relative;
    color: var(--el-color-primary);
    transition: all 0.3s;

    &:before {
      height: 50%;
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      content: '';
      background: var(--el-color-primary);
      width: 2px;
      border-radius: 2px;
    }
  }
}


</style>
