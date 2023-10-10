import {ElMessage} from "element-plus";
import dayjs from "dayjs";

export function useBaseTable(getList, delItem, searchForm, limit) {
  const pagination = ref({
    page: 1,
    limit: limit || 10,
    totalCount: 0
  })

  const isLoading = ref(false)

  const tableData = ref([])

  onMounted(() => {
    getListData()
  })

  // 请求数据
  const getListData = async () => {
    const {page, limit} = pagination.value;
    let params = {page, limit};
    isLoading.value = true

    if (searchForm.value) {
      for (let key in searchForm.value) {
        if (searchForm.value[key]) {
          params[key] = searchForm.value[key]
        }
      }
    }

    const res = await getList(params);
    if (res) {
      isLoading.value = false

      tableData.value = res.list.map((item, index) => {
        if (item.createdAt) {
          item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        }
        if (item.updatedAt) {
          item.updatedAt = dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        }
        return item
      })
      pagination.value = res.pagination;
    }
  }

  // 重置搜索数据
  const handleReset = () => {
    for (let key in searchForm.value) {
      searchForm.value[key] = ''
    }
    getListData()
  }


  // 删除数据
  const handleDelete = async ({id}) => {
    try {
      await delItem({id})
      await getListData()
      ElMessage.success('删除成功')
    } catch (e) {

    }
  }

  return {
    pagination,
    isLoading,
    tableData,
    getListData,
    handleReset,
    handleDelete
  }
}