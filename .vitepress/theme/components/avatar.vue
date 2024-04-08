<script setup>
import { ElAvatar } from "element-plus";
import { ref } from "vue";

const isLogin = ref(false);

const btn = () => {
  isLogin.value = true;
};
</script>

<template>
  <div class="ml-4">
    <el-avatar v-if="!isLogin" :size="35" class="cursor-pointer"
      ><span class="text-[8px]" @click="btn">点击登录</span></el-avatar
    >
    <el-avatar v-else :size="35" class="cursor-pointer bg-orange-400"
      ><span class="text-[8px]">copyer</span></el-avatar
    >
  </div>
</template>

<style scoped></style>
