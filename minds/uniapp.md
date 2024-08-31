---
layout: home
---

<script setup>
import {ref} from 'vue'
import mind from '../.vitepress/components/mind.vue'
const data = ref(`
# uni-app

## 环境搭建

- HBuilderX 安装
- 运行多端
- 发包多端

## 目录结构

- main.js
- App.vue
- pages.json
- pages
- components
- static
- uni_modules
- node_modules
- ...

## 开发规范

- 组件靠近小程序规范
- 接口能力靠近微信小程序规范
- 数据绑定以及事件处理靠近 vue 方式
- 多端建议使用 flex 布局

## 基础语法

- 配置文件
- 全局样式及局部样式：scss、单位
- 内置组件和扩展组件：uni-ui等

## 核心语法

- 条件编译
- 生命周期：组件生命周期、页面生命周期、App 生命周期
- 页面路由
- 状态管理：pinia
- 页面通讯
- 常用API：网络请求，数据缓存

`)
</script>

<mind :data="data" />
