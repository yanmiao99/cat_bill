<template>
  <div class="note-labels-and-category">

    <tagEdit :type="1" title="笔记标签"/>

    <tagEdit :type="2" title="分类标签"/>

  </div>
</template>

<script setup>

import TagEdit from "@/components/tagEdit/tagEdit.vue";

</script>


<style scoped lang="scss">
.note-labels-and-category {

}
</style>
