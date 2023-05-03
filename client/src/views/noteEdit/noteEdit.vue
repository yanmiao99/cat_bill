<template>
  <div class="note-edit">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>新增笔记</span>
          <el-input
              v-model="state.title"
              placeholder="笔记标题"
          />
          <el-button type="primary">发布</el-button>
        </div>
      </template>
      <MdEditor
          v-model="state.text"
          :theme="state.theme"
          placeholder="开始写笔记吧~"
          ref="editorRef"
          style="height: 100%"
          :toolbars="toolbars"
          :previewTheme="state.previewTheme"
      />
    </el-card>
  </div>
</template>

<script setup>
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {commonStore} from "@/store/common";
import {reactive, watch} from "vue";
import {useRouter, useRoute} from "vue-router";

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
  text: '', // 编辑器内容
  title: '' // 笔记标题
});

const editorRef = ref(null);
onMounted(() => {
  editorRef.value?.focus();
})

const route = useRoute()

console.log(route.path);


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
        alert('保存了吗')
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
</style>