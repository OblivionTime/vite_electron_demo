<template>
    <div>
        Home
        <button @click="toIndex">跳转</button>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const router=useRouter()
const toIndex=()=>{
    router.push({name:"index"})
}
</script>

<style lang="scss" scoped>

</style>