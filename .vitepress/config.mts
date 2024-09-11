import { defineConfig } from "vitepress";
import { nav } from "./config/nav.mts";
import { sidebar } from "./config/sidebar.mjs";
import timeline from "vitepress-markdown-timeline";
import { baseUrl } from "./config/config";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "石膏银码农",
  base: baseUrl,
  description: "Copyer",
  head: [
    ["link", { rel: "icon", href: "/docs/logo.svg" }], //favicon图标设置
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  markdown: {
    lineNumbers: true, // 显示代码块行号
    config: (md) => {
      md.use(timeline);
    },
    image: {
      // 开启懒加载
      lazyLoading: true,
    },
  },
  themeConfig: {
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,
    outline: { level: "deep" },
    outlineTitle: "本篇目录",
    socialLinks: [
      {
        icon: {
          svg: '<svg t="1713230701078" class="icon" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4911" width="240" height="240"><path d="M643.182 247.698l154.916-123.172L643.182 0.256l-0.11-0.256-154.66 124.27 154.66 123.245 0.11 0.183z m0 388.462h0.11l399.579-315.246-108.361-87.04L643.29 463.762h-0.146l-0.11 0.147-291.218-229.815-108.251 87.04L642.999 636.27l0.146-0.147z m-0.147 215.552l0.147-0.146 534.893-422.035 108.398 87.04-243.31 192L643.145 1024 10.423 525.056 0 516.754l108.251-86.893 534.784 421.888z" fill="#1E80FF" p-id="4912"></path></svg>',
        },
        link: "https://juejin.cn/user/2823965976323016/posts",
      },
    ],
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {
      message: "石膏银码农",
      copyright: "Copyright by @Copyer 2024-01-01",
    },
  },
  vite: {
    server: {
      port: 7240,
    },
  },
});
