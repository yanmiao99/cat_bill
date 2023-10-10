<!-- 基础测试用例, 不可使用 请复制到其他文件中使用 -->

<template>
  <div class="basic-table">
    <div class="header_operation">
      <el-form style="width: 100%" :inline="true" :model="queryForm" @submit.native.prevent>
        <el-form-item label="名称" style="flex: 1">
          <el-input
              v-model="queryForm.name"
              placeholder="按名称搜索(可模糊搜索)"
              @keyup.enter="getData"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
          <el-button type="info" @click="handleResize" plain>重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddOrEdit('add',{})">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
        :data="tableData"
        stripe
        border
        v-loading="loading"
        empty-text="暂无数据">
      <el-table-column align="center" label="id" prop="id"/>
      <el-table-column align="center" label="作者" prop="author"/>
      <el-table-column align="center" label="名称" prop="name"/>
      <el-table-column align="center" label="更新时间" prop="updatedAt"/>
      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleAddOrEdit('edit',scope.row)">编辑</el-button>

          <el-popconfirm title="你确定删除吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="text" style="color: #F56C6C" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer_operation">
      <el-pagination
          background
          layout="total,prev, pager, next"
          v-model:page-size="pagination.pageSize"
          v-model:current-page="pagination.pageNum"
          :total="pagination.totalCount"
          @current-change="getData"
      />
    </div>


    <BasicDialog
        v-model="visible"
        :title='title'
        width="30%"
    >
      test
    </BasicDialog>

  </div>
</template>

<script setup>
import {getTableDelete, getTableList} from '@/api/table'
import {useBasicTable} from "@/hooks/useBasicTable.js";
import {useBasicDialog} from "@/hooks/basicDialog/useBasicDialog.js";
import BasicDialog from "@/hooks/basicDialog/basicDialog.vue";

const {
  visible,
  title,
  openDialog,
} = useBasicDialog()

// 搜索数据
const queryForm = ref({
  name: ''
})

const {
  tableData,
  loading,
  pagination,
  getData,
  handleResize,
  handleDelete,
} = useBasicTable(getTableList, getTableDelete, queryForm)


const handleAddOrEdit = (type, row) => {
  console.log(row)
  openDialog()
}


</script>

<style scoped lang="scss">
</style>
