

<template>
  <div>
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
</style>
