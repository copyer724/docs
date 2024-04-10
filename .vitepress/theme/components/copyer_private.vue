<script setup>
import { ref } from "vue";
import { ElEmpty, ElButton } from "element-plus";
import TimeLine from "./timeline.vue";
import { baseUrl } from "../../config/config";
const isLogin = ref(sessionStorage.getItem("token"));

const btn = () => {
  if (location.pathname === `${baseUrl}login`) return;
  location.href = `${baseUrl}login`;
};
</script>

<template>
  <template v-if="isLogin">
    <time-line />
  </template>
  <template v-else>
    <el-empty :image-size="250" description="未登录，请先登录">
      <template #image>
        <img src="/403.svg" alt="403" />
      </template>
      <el-button type="primary" class="btn" @click="btn" size="large"
        >前往登录</el-button
      >
    </el-empty>
  </template>
</template>

<style scoped>
.btn {
  background-color: var(--vp-button-brand-bg);
  outline: none;
  border: none;
}
.btn:hover {
  background-color: var(--vp-button-brand-bg);
  opacity: 0.8;
}
</style>
