<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { successTxt, generateToken } from "../utils/index";
const notes = {
  error: "您输入错了~~~",
  empty: "别偷懒~~~",
  default: "",
};
const errotTxt = ref("default");
const userInfo = reactive({ username: undefined, password: undefined });

const handleFocus = () => (errotTxt.value = "default");

const submit = () => {
  if (!userInfo.username || !userInfo.password) {
    errotTxt.value = "empty";
    return;
  }
  if (generateToken(userInfo) !== successTxt) {
    errotTxt.value = "error";
    return;
  }
  sessionStorage.setItem("token", generateToken(userInfo));
  ElMessage({
    message: "登录成功！",
    type: "success",
    plain: true,
  });
  setTimeout(() => {
    window.history.go(-1);
  }, 500);
};

const keyDown = (e) => {
  if (e.keyCode == 13 || e.keyCode == 100) {
    submit();
  }
};
onMounted(() => {
  //绑定监听事件
  window.addEventListener("keydown", keyDown);
});
onUnmounted(() => {
  //销毁事件
  window.removeEventListener("keydown", keyDown, false);
});
</script>

<template>
  <div class="login-box">
    <div class="form">
      <div class="title">Welcome</div>
      <div class="subTitle">Let's create your account!</div>
      <div class="input-container ic1">
        <input
          placeholder="用户名"
          autocomplete="off"
          type="text"
          @focus="handleFocus"
          v-model="userInfo.username"
          class="input"
          id="firstname"
        />
        <div class="cut"></div>
        <label class="iLabel" for="firstname">用户名</label>
      </div>
      <div class="input-container ic2">
        <input
          autocomplete="new-password"
          placeholder="密码"
          type="password"
          @focus="handleFocus"
          v-model="userInfo.password"
          class="input"
          id="password"
        />
        <div class="cut"></div>
        <label class="iLabel" for="password">密码</label>
      </div>
      <button
        class="submit"
        type="text"
        @click="submit"
        @keydown.enter="keyDown"
      >
        登录
      </button>

      <div v-if="notes[errotTxt]" class="mt-6 text-center text-[#f00]">
        {{ notes[errotTxt] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-box {
  width: 100%;
  height: calc(100vh - 64px);
  background: url("/login.png");
  background-size: 100% 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  background-color: #c6c6c6;
  border-radius: 20px;
  box-sizing: border-box;
  width: 400px;
  height: 500px;
  padding: 20px;
  box-shadow: 0px 0px 8px #c6c6c6;
}

.title {
  color: #424141;
  font-family: sans-serif, Verdana, Geneva, Tahoma;
  font-size: 36px;
  font-weight: 600;
  margin-top: 30px;
}
.subTitle {
  color: #424141;
  font-family: sans-serif, Verdana, Geneva, Tahoma;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}
.input-container {
  width: 100%;
  height: 50px;
  position: relative;
}
.input {
  background-color: #d8d8d8;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #424141;
  font-size: 18px;
  height: 100%;
  outline: 0;
  padding: 4px 20px 0;
  width: 100%;
}
.ic1 {
  margin-top: 40px;
}
.ic2 {
  margin-top: 30px;
}
.cut {
  background-color: #c6c6c6;
  border-radius: 10px;
  height: 20px;
  position: absolute;
  left: 20px;
  top: -20px;
  transform: translateY(0);
  transition: transform 200ms;
  width: 60px;
}
.iLabel {
  color: transparent;
  font-family: sans-serif, Verdana, Geneva, Tahoma;
  left: 20px;
  line-height: 14px;
  pointer-events: none;
  position: absolute;
  transform-origin: 0 50%;
  transition: transform 200ms, color 200ms;
  top: 20px;
}
.input:focus ~ .cut {
  transform: translateY(8px);
}
.input:focus ~ .iLabel {
  transform: translateY(-30px) translateX(10px) scale(0.8);
  color: #ff5722;
  font-weight: 500;
}
.input::placeholder {
  color: #7e7d7d;
}
.input:focus::placeholder {
  color: transparent;
}

.submit {
  background-color: #ff5722;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  cursor: pointer;
  color: #eee;
  font-size: 18px;
  height: 50px;
  margin-top: 38px;
  text-align: center;
  width: 100%;
}
.submit:hover {
  opacity: 0.95;
}
</style>
