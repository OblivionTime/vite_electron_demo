

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

onMounted(() => {
  router.push("/");
});
</script>
<style scoped>
#app {
  box-sizing: border-box;
  padding: 15px;
  color: white;
  height: 100vh;
  width: 100%;
  position: relative;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  background: url(./assets/img/back.png) no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
