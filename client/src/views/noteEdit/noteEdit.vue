<template>
  <div class="note-edit">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ dialogTitle }}</span>
          <el-button type="primary" @click="handleSubmit">发布</el-button>
        </div>
      </template>
      <MdEditor
          v-model="state.detail"
          :theme="state.theme"
          placeholder="开始写笔记吧~"
          ref="editorRef"
          style="height: 100%"
          :toolbars="toolbars"
          :previewTheme="state.previewTheme"
          @onUploadImg="onUploadImg"
      />
    </el-card>

    <BasicDialog
        v-model="visible"
        :title='dialogTitle'
        width="500"
        @confirm="handleSubmitConfirm"
    >
      <div class="dialog-content">
        <el-form
            style="width: 100%"
            :model="noteModal"
        >
          <el-form-item label="标题">
            <el-input
                v-model="noteModal.title"
                clearable
                style="width:100%"
                placeholder="请输入标题">
            </el-input>
          </el-form-item>

          <el-form-item label="标签">
            <el-select v-model="noteModal.tag" multiple placeholder="请选择标签" style="width: 100%">
              <el-option
                  v-for="item in noteModalTagList"
                  :key="item.id"
                  :label="item.tag"
                  :value="item.tag">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="分类">
            <el-select v-model="noteModal.category" multiple placeholder="请选择分类" style="width: 100%">
              <el-option
                  v-for="item in noteModalCategoryList"
                  :key="item.id"
                  :label="item.tag"
                  :value="item.tag">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="封面">
            <upload-img
                tips="上传封面"
                v-model:file="noteModal.cover"
            />
          </el-form-item>
        </el-form>
      </div>
    </BasicDialog>
  </div>
</template>

<script setup>
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {commonStore} from "@/store/common";
import {reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useBasicDialog} from "@/hooks/basicDialog/useBasicDialog.js";
import BasicDialog from "@/hooks/basicDialog/basicDialog.vue";
import UploadImg from "@/components/uploadImg/uploadImg.vue";
import {getNoteTagInfo} from "@/api/noteLabelsAndCategory";
import {addNote, getNoteList, updateNote} from "@/api/noteList";
import {uploadImage} from "@/api/upload";
import {ElMessage} from "element-plus";

const router = useRouter()
const route = useRoute()

const {
  visible,
  title,
  openDialog,
  closeDialog,
} = useBasicDialog()

MdEditor.config({
  editorConfig: {
    // 语言
    languageUserDefined: {
      'zh-CN': {
        toolbarTips: {
          bold: '加粗',
          underline: '下划线',
          italic: '斜体',
          strikeThrough: '删除线',
          title: '标题',
          sub: '下标',
          sup: '上标',
          quote: '引用',
          unorderedList: '无序列表',
          orderedList: '有序列表',
          task: '任务列表',
          codeRow: '行内代码',
          code: '块级代码',
          link: '链接',
          image: '图片',
          table: '表格',
          mermaid: 'mermaid图',
          katex: 'katex公式',
          revoke: '后退',
          next: '前进',
          save: '保存',
          prettier: '美化',
          pageFullscreen: '浏览器全屏',
          fullscreen: '屏幕全屏',
          preview: '预览',
          htmlPreview: 'html代码预览',
          catalog: '目录',
          github: '源码地址'
        },
        titleItem: {
          h1: '一级标题',
          h2: '二级标题',
          h3: '三级标题',
          h4: '四级标题',
          h5: '五级标题',
          h6: '六级标题'
        },
        imgTitleItem: {
          link: '添加链接',
          upload: '上传图片',
          clip2upload: '裁剪上传'
        },
        linkModalTips: {
          linkTitle: '添加链接',
          imageTitle: '添加图片',
          descLabel: '链接描述：',
          descLabelPlaceHolder: '请输入描述...',
          urlLabel: '链接地址：',
          urlLabelPlaceHolder: '请输入链接...',
          buttonOK: '确定'
        },
        clipModalTips: {
          title: '裁剪图片上传',
          buttonUpload: '上传'
        },
        copyCode: {
          text: '复制代码',
          successTips: '已复制！',
          failTips: '复制失败！'
        },
        mermaid: {
          flow: '流程图',
          sequence: '时序图',
          gantt: '甘特图',
          class: '类图',
          state: '状态图',
          pie: '饼图',
          relationship: '关系图',
          journey: '旅程图'
        },
        katex: {
          inline: '行内公式',
          block: '块级公式'
        },
        footer: {
          markdownTotal: '字数',
          scrollAuto: '同步滚动'
        }
      }
    },
    // mermaid模板
    mermaidTemplate: {
      // 流程图
      flow: `flow tempalte`,
      // 时序图
      sequence: `sequence template`,
      // 甘特图
      gantt: `gantt template`,
      // 类图
      class: `class template`,
      // 状态图
      state: `state template`,
      // 饼图
      pie: `pie template`,
      // 关系图
      relationship: `relationship template`,
      // 旅程图
      journey: `journey template`
    },
    // 输入渲染延迟（ms）
    renderDelay: 0
  }
});

const toolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  // 'mermaid',
  // 'katex',
  '-',
  'revoke',
  'next',
  // 'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
  // 'github'
];

const store = commonStore()

const state = reactive({
  theme: 'light', // dark , light
  previewTheme: 'github',
  detail: '', // 编辑器内容
});

const editorRef = ref(null);

// 笔记内容
const noteModal = ref({
  cover: '',
  title: '',
  detail: '',
  tag: [],
  category: [],
})

const noteModalTagList = ref([])
const noteModalCategoryList = ref([])

const dialogTitle = ref('新增笔记')

onMounted(() => {
  editorRef.value?.focus();

  console.log(route.query);
  if (route.query.id) {
    dialogTitle.value = '编辑笔记'
    getNoteDetail()
  }
})

// 提交
const handleSubmit = () => {
  noteModal.value.detail = state.detail
  getTagAndCategory()
  openDialog()
}

// 提交确认
const handleSubmitConfirm = async () => {
  const type = route?.query?.type
  let res = null
  if (type && type === 'edit') {
    res = await updateNote({
      id: route.query.id,
      ...noteModal.value
    })
  } else {
    res = await addNote({
      ...noteModal.value
    })
  }

  if (res) {
    closeDialog()
    router.push({
      path: '/noteList'
    })
  }
}

// 获取标签和分类
const getTagAndCategory = async () => {
  const {list} = await getNoteTagInfo()

  let tagList = []
  let categoryList = []
  if (list && list.length) {

    list.forEach(item => {
      if (item.type === 1) {
        tagList.push(item)
      } else if (item.type === 2) {
        categoryList.push(item)
      }
    })

    noteModalTagList.value = tagList
    noteModalCategoryList.value = categoryList
  }
}

// 获取单条数据
const getNoteDetail = async () => {
  const res = await getNoteList({
    id: route.query.id
  })
  if (res) {
    noteModal.value = {
      ...res.list[0],
    }
    state.detail = res.list[0].detail
  }
}

// 处理编辑器上传图片
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('file', file);
          uploadImage(form)
              .then((res) => rev(res))
              .catch((error) => rej(error));
        });
      })
  );

  callback(res.map((item) => item.url));
}

watch(
    () => ({
      currentTheme: store.getDarkMode,
      currentPath: route.path
    }),
    (newVal) => {
      if (newVal.currentTheme === 'dark') {
        state.theme = 'dark'
      } else {
        state.theme = 'light'
      }
      if (newVal.currentPath !== '/noteEdit') {
        // alert('保存了吗')
        console.log('需要提示保存');
      }
    },
    {immediate: true}
)

</script>

<style scoped lang="scss">
.box-card {
  position: absolute;
  top: 70px;
  left: 20px;
  bottom: 20px;
  right: 20px;
  box-sizing: border-box;
  height: calc(100vh - 90px);

  :deep(.el-card__body) {
    height: 83%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-input {
      flex: 0.5;
      margin: 0 20px;
    }
  }
}

.dialog-content {
  padding: 0 20px;
  box-sizing: border-box;
}
</style>