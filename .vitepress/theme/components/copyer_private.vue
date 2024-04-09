<script setup>
import { ref } from "vue";
import { ElEmpty, ElButton } from "element-plus";
import TimeLine from "./timeline.vue";
import NotLogin from "./notLogin.svg";
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
    <el-empty
      :image="NotLogin"
      :image-size="250"
      description="未登录，请先登录"
    >
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
