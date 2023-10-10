<template>
  <div class="note-list">
    <div class="header_operation">
      <el-form style="width: 100%" :inline="true" :model="searchForm" @submit.native.prevent>
        <el-form-item label="标题" style="flex: 1">
          <el-input
              v-model="searchForm.title"
              clearable
              :prefix-icon="Search"
              style="width:100%"
              @keydown.enter="getListData"
              placeholder="请输入标题(可模糊搜索)">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleReset" plain>重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="gotoNoteList('add')">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
        :data="tableData"
        stripe
        border
        empty-text="暂无数据">
      <el-table-column align="center" label="ID" prop="id" sortable width="70"/>
      <el-table-column align="center" label="标题" prop="title" sortable/>
      <el-table-column align="center" label="标签">
        <template #default="scope">
          <el-tag v-for="tagItem in scope.row.tag" :key="tagItem">{{ tagItem }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template #default="scope">
          <el-tag v-for="categoryItem in scope.row.category" :key="categoryItem">{{ categoryItem }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createdAt" sortable/>
      <el-table-column align="center" label="修改时间" prop="updatedAt" sortable/>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button plain type="primary" :icon="Edit" @click="gotoNoteList('edit',scope.row)"/>
          <el-popconfirm title="你确定删除该条数据吗?" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button plain type="danger" :icon="Delete"/>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer_operation">
      <el-pagination
          background
          layout="prev, pager, next"
          v-model:page-size="pagination.limit"
          v-model:current-page="pagination.page"
          :total="pagination.totalCount"
      />
    </div>
  </div>
</template>

<script setup>
import {Edit, Delete, Search} from "@element-plus/icons-vue";
import {useBaseTable} from "@/hooks/useBaseTable.js";
import {getNoteList, deleteNote} from "@/api/noteList";
import {useRouter} from "vue-router";

const router = useRouter()

// 搜索
const searchForm = ref({
  title: '',
});

const {
  tableData,
  isLoading,
  pagination,
  getListData,
  handleReset,
  handleDelete
} = useBaseTable(getNoteList, deleteNote, searchForm, 10)

const gotoNoteList = (type, row) => {

  let path = ''
  if (type === 'add') {
    path = './noteEdit'
  } else {
    path = `./noteEdit?type=${type}&id=${row.id}`
  }
  router.push(path)
}

</script>

<style scoped lang="scss">
.el-tag {
  margin: 5px;
}
</style>