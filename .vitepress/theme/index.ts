// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import TimeLine from "./components/timeline.vue";
import CopyerPrivate from "./components/copyer_private.vue";
// import NewDefaultTheme from "./Layout.vue";
import Avatar from "./components/avatar.vue";
import Login from "./components/login.vue";

import "element-plus/dist/index.css";
import "./style.css";
import "./custom.css";
import "vitepress-markdown-timeline/dist/theme/index.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "nav-bar-content-after": () => h(Avatar),
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("time-line", TimeLine);
    app.component("copyer-private", CopyerPrivate);
    app.component("login", Login);
    // ...
  },
} satisfies Theme;
