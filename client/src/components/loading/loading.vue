<template>
  <div class="loading" v-show="msg.show">
    <img src="./loading.svg" alt="loading">
    <p>{{ msg.title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    msg: Object,
  }
}
</script>

<style scoped lang="scss">
.loading {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    width: 100px;
    height: 100px;
  }

  p {
    margin-top: 20px;
    font-size: 14px;
    color: #333;
  }
}
</style>
