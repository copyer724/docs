import { NavItem } from "./d";
export const nav: NavItem[] = [
  {
    text: "基础系列",
    items: [
      {
        text: "HTML/CSS",
        link: "/basics/hc/",
      },
      {
        text: "JavaScript",
        link: "/basics/js/",
      },
      {
        text: "TypeScript",
        link: "/basics/ts/",
      },
      { text: "数据结构", link: "/basics/data-structure/" },
      { text: "计算机原理", link: "/basics/computer-theory/" },
    ],
  },
  {
    text: "框架系列",
    items: [
      { text: "Vue", link: "/frames/vue/" },
      { text: "React", link: "/frames/react/" },
      {
        text: "",
        items: [
          { text: "微信小程序", link: "/frames/wechat/" },
          { text: "Uniapp", link: "/frames/uniapp/" },
          { text: "Taro", link: "/frames/taro/" },
        ],
      },
    ],
  },
  {
    text: "前端工程化",
    items: [
      { text: "Webpack", link: "/engineerings/webpack/" },
      { text: "Vite", link: "/engineerings/vite/" },
      { text: "Rollup", link: "/engineerings/rollup/" },
      { text: "Git", link: "/engineerings/git/" },
      { text: "Nginx", link: "/engineerings/nginx/" },
      { text: "Other", link: "/engineerings/other/" },
      {
        text: "",
        items: [
          { text: "性能优化", link: "/engineerings/optimization/" },
          { text: "前端安全", link: "/engineerings/safety/" },
        ],
      },
    ],
  },
  {
    text: "服务端",
    items: [
      { text: "Nodejs", link: "/servers/node/" },
      { text: "Express", link: "/servers/express/" },
      { text: "Koa", link: "/servers/koa/" },
      { text: "Nestjs", link: "/servers/nest/" },
      { text: "数据库", link: "/servers/sql/" },
    ],
  },
  {
    text: "LeetCode",
    items: [
      { text: "数组篇", link: "/leetcode/array/" },
      { text: "链表篇", link: "/leetcode/link/" },
      { text: "回溯算法篇", link: "/leetcode/recall/" },
      { text: "动态规划", link: "/leetcode/dynamic/" },
    ],
  },
  {
    text: "理论与实操",
    items: [
      { text: "理论细说", link: "/theory/theory/" },
      { text: "功能实现", link: "/theory/action/" },
      { text: "工具系列", link: "/theory/tool/" },
    ],
  },
  {
    text: "面试系列",
    items: [
      { text: "手写系列", link: "/interview/handRealize/" },
      { text: "八股文", link: "/interview/stereotypedWriting/" },
      { text: "项目汇集", link: "/interview/projects/" },
    ],
  },
  {
    text: "个人博客",
    link: "/blogs/",
  },
];
