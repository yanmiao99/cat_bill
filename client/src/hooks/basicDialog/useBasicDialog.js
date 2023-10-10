import {ref} from "vue";

export function useBasicDialog() {
  const visible = ref(false);
  const loading = ref(false);
  const title = ref('基础弹窗');
  const mode = ref('default');

  const modeObj = {
    add: '新增',
    edit: '编辑',
    default: '基础弹窗'
  }

  const openDialog = (type) => {
    title.value = modeObj[type] || modeObj.default
    mode.value = type || 'default'
    visible.value = true
  };
  const closeDialog = () => (visible.value = false);
  const openLoading = () => (loading.value = true);
  const closeLoading = () => (loading.value = false);
  return {
    visible,
    title,
    mode,
    loading,

    openDialog,
    closeDialog,
    openLoading,
    closeLoading,
  };
}
