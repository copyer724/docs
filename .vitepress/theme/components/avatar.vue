<script setup>
import {
  ElAvatar,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
} from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import { ref } from "vue";
import { baseUrl } from "../../config/config";
import Ava from "./avater.svg";

const isLogin = ref(!!sessionStorage.getItem("token"));

const btn = () => {
  if (location.pathname === `${baseUrl}login`) return;
  location.href = `${baseUrl}login`;
};

const select = (e) => {
  switch (e) {
    case "about":
      location.href = `${baseUrl}about`;
      break;
    case "logout":
      sessionStorage.removeItem("token");
      isLogin.value = false;
      break;
  }
};
</script>

<template>
  <div class="ml-4">
    <el-avatar v-if="!isLogin" :size="35" class="cursor-pointer"
      ><span class="text-[8px]" @click="btn">点击登录</span></el-avatar
    >
    <template v-else>
      <el-dropdown placement="bottom-start" @command="select">
        <div class="flex items-center">
          <img :src="Ava" class="h-10 w-10" />
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="about">关于我</el-dropdown-item>
            <el-dropdown-item divided command="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
</template>

<style scoped>
:deep(:focus-visible) {
  outline: none;
}
</style>
