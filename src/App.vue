<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {onMounted } from 'vue';
const router=useRouter()
onMounted(() => {
  router.push("/")
})
</script>

<style lang="scss" scoped></style>