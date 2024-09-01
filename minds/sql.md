---
layout: home
---

<script setup>
import {ref} from 'vue'
import home from '../.vitepress/components/mind.vue'
const data = ref(`
# SQL 

## 基本知识

1. 标题1
2. 标题2

-. 子标题1
-. 子标题2

5. 标题2
6. 标题3

- beautiful
- useful
- easy
- interactive

## 场景知识

### 配置文件

1. .env
2. js-yaml
3. @nestjs/config

### redis
  - GUI
  - npm: redis
  - npm: ioredis
  - nest 中使用

`)
</script>

<home :data="data" />
