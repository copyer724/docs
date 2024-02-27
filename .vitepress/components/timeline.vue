<template>
  <div class="box">
    <div class="timeline-content">
      <div
        :class="item.class"
        v-for="(item, index) in timelineList"
        :key="index"
      >
        {{ item.title }}
        <div :class="it.class" v-for="(it, idx) in item.children" :key="idx">
          <div class="date">
            {{ it.date }}
          </div>
          <div class="content">
            {{ it.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const timelineList = ref([
  {
    class: "desc",
    title: "昨日重现",
    date: "",
    children: [],
  },
  {
    class: "title",
    title: "2023",
    date: "",
    children: [
      {
        class: "item",
        title: "分布式存储系统——Ceph 部署使用",
        date: "12-25",
        children: [],
      },
      {
        class: "item",
        title: "使用 Axis 调用 WebService 服务接口",
        date: "12-20",
        children: [],
      },
      {
        class: "item",
        title: "树洞",
        date: "10-22",
        children: [],
      },
    ],
  },
  {
    class: "title",
    title: "2023",
    date: "",
    children: [
      {
        class: "item",
        title: "分布式存储系统——Ceph 部署使用",
        date: "12-25",
        children: [],
      },
      {
        class: "item",
        title: "使用 Axis 调用 WebService 服务接口",
        date: "12-20",
        children: [],
      },
      {
        class: "item",
        title: "树洞",
        date: "10-22",
        children: [],
      },
    ],
  },
]);
</script>

<style scoped>
.box {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 40px;
}
.timeline-content {
  box-sizing: border-box;
  width: 100%;
  position: relative;
  margin: 15px 0;
  padding-left: 18px;
}

.timeline-content::after {
  content: " ";
  position: absolute;
  top: 14px;
  left: 0;
  z-index: -1;
  margin-left: -2px;
  width: 4px;
  height: 100%;
  background: #eaecef;
}

.desc {
  color: #242424;
  position: relative;
}
.desc::before {
  content: " ";
  position: absolute;
  z-index: 2;
  left: -18px;
  top: 50%;
  margin-left: -4px;
  margin-top: -4px;
  width: 8px;
  height: 8px;
  background: #FF5722;
  border: 1px solid #FF5722;
  border-radius: 50%;
}

.title {
  color: #242424;
  font-weight: 700;
  position: relative;
  font-size: 27px;
  margin-top: 80px;
}

.title::before {
  content: " ";
  position: absolute;
  z-index: 2;
  left: -18px;
  top: 19px;
  margin-left: -4px;
  margin-top: -4px;
  width: 8px;
  height: 8px;
  background: #FF5722;
  border: 1px solid #FF5722;
  border-radius: 50%;
}

.item {
  display: flex;
  padding: 10px 20px;
  list-style: none;
  position: relative;
  border-bottom: 2px solid rgba(153, 157, 160, 0.42);
  background: rgba(193, 193, 230, 0.149);
  border-radius: 5rem;
  margin: 5px 0;
  align-items: center;
  transition: all 0.5s;
  font-weight: 400;
  color: #7f7f7f;
}

.date {
  font-size: 13px;
  margin-right: 10px;
}
.date::before {
  top: 18px;
  border: 1px solid;
  content: " ";
  position: absolute;
  left: -18px;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  background: #fff;
  border-radius: 50%;
  z-index: 2;
}

.item .content {
  cursor: pointer;
  font-size: 16px;
}

.item:hover {
  color: #FF5722;
  transform: translate(50px);
}
.item:hover .date::before {
  background: #FF5722;
  border: 1px solid #FF5722;
}
</style>
