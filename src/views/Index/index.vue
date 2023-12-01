<template>
    <div>
        Index
        <button @click="ToHome">跳转</button>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
const router=useRouter()
const ToHome=()=>{
    router.push("/home")
}
</script>

<style lang="scss" scoped></style>