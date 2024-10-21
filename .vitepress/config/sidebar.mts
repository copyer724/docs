// vite-plugin-vitepress-auto-sidebar 这个插件自动导航，生成的太多，不是我想要的

import { Sidebar } from "./d";
import { generateDirectory } from "../utils";

// 路由配置（只支持二级路由）
const sides = [
  {
    text: "basics",
    children: ["hc", "js", "ts", "data-structure", "computer-theory"],
  },
  {
    text: "frames",
    children: ["vue", "react", "wechat", "uniapp", "taro"],
  },
  {
    text: "engineerings",
    children: [
      "webpack",
      "vite",
      "rollup",
      "git",
      "nginx",
      "other",
      "optimization",
      "safety",
    ],
  },
  {
    text: "servers",
    children: ["node", "express", "koa", "nest", "sql"],
  },
  {
    text: "leetcode",
    children: ["array", "link", "recall", "dynamic"],
  },
  {
    text: "theory",
    children: ["theory", "action", "tool"],
  },
  {
    text: "interview",
    children: ["handRealize", "stereotypedWriting", "projects"],
  },
];

function generateMap() {
  let arr: string[] = [];
  sides.forEach((v) => {
    v.children.forEach((subItem) => {
      arr.push(`/${v.text}/${subItem}`);
    });
  });

  let routerObj = {};
  arr.forEach((v) => {
    routerObj[v] = generateDirectory(v);
  });
  return routerObj;
}

// export const sidebar: Sidebar = {
//   "/basics/hc": [
//     {
//       text: "html",
//       items: [
//         {
//           text: "html",
//           link: "/basics/hc/01_BFC",
//         },
//       ],
//     },
//     {
//       text: "css",
//       // link: "/basics/hc/test/test",
//       collapsed: true,
//       items: [
//         {
//           text: "css",
//           link: "/basics/hc/02_flex",
//         },
//       ],
//     },
//   ],
// };

export const sidebar: Sidebar = generateMap();
