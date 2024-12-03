---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Actor"
  text: "开发知识宝典"
  tagline: 每天多问自己几个为什么，总有想象不到的意外收获。
  image:
    src: /home.svg
  actions:
    - theme: brand
      text: 码农知识
      link: basics/hc/
    - theme: alt
      text: 关于我
      link: /about

features:
  - title: uni-app
    icon:
      src: /images/mind/uniapp.svg
    details: uni-app 是一个使用 Vue.js 开发所有前端应用的框架，编写一套代码，可发布到等多个平台。
    link: minds/uniapp.md
    linkText: 知识脑图
  - title: NestJS
    icon:
      src: /images/mind/nestjs.svg
    details: 企业级的 Node 框架，Node 中的 SpringBoot。
    link: minds/nestjs.md
    linkText: 知识脑图
  - title: TypeScript
    icon:
      src: /images/mind/ts.svg
    details: JavaScript 的超集，用于构建大型应用。
    link: minds/ts.md
    linkText: 知识脑图
---

### 新知识学习步骤

1. 它是什么？
2. 为什么要学习？使用场景在哪里？
3. 怎么使用？具体语法是什么？
4. 加分项：为什么要这么使用？

### 近期目标

- nestjs 学习
- 前端组件库搭建
- 工具函数搭建
- leetcode
- like-admin 的系统开发

### 后续动作

- vue3 源码赏析：https://www.bilibili.com/video/BV13YDmYWEbx/?spm_id_from=333.999.0.0&vd_source=73b012c3730a25fea48281b3af665c0e
- React18 源码赏析：https://www.bilibili.com/video/BV1SDm2Y3ETD/?spm_id_from=333.999.0.0&vd_source=73b012c3730a25fea48281b3af665c0e

### 开发经验总结

- **考虑边界值**：如果要展示一个列表，就要考虑列表为空、列表长度超过一页的情况；如果展示的是文字，则要考虑文字为空、文字超长的情况；访问 a.b.c 时，a 或 b 是否可能为 undefined
- **考虑特殊场景**：如交互状态（hover、disabled、文字提示）、浮点数计算精度（使用 utils 方法）、防重复提交、分辨率兼容、移动设备兼容、事件冒泡、防抖和节流；
- **考虑需求变更和功能拓展**：需求变更是不可避免的，那就要在开发的时候考虑到哪些地方容易变(数值、变量)，哪些不容易变（框架、模式），提前做好设计规划，减少因需求变更造成的大规模重构。
- **考虑代码可读性**：复杂方法标注用途、复杂逻辑解释清楚、修改他人代码先理解上下文并做好自测。
- 减少魔法值，使用枚举常量代替
- 不要让用户等待，用户的所有操作，都需要给用户一个返回，感觉程序在走
