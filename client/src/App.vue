<script setup lang="ts">
import {useAuthStore} from "@/stores";
import {onMounted} from "vue";

const AuthStore = useAuthStore()

onMounted(async () => {
  await AuthStore.fetchUserList()
})
</script>

<template>
  <RouterView/>
</template>

<style scoped>
</style>
