<script setup>
import { ref, onMounted, onUpdated } from "vue";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

const props = defineProps({
  data: {
    type: String,
  },
});

const transformer = new Transformer();

const mm = ref();
const svgRef = ref();

const update = () => {
  const { root } = transformer.transform(props.data ?? ``);
  mm.value.setData(root);
  mm.value.fit();
};

const zoomIn = () => mm.value.rescale(1.25);

const zoomOut = () => mm.value.rescale(0.8);

const fitToScreen = () => mm.value.fit();

onMounted(() => {
  // 初始化markmap思维导图
  mm.value = Markmap.create(svgRef.value);
  // 更新思维导图渲染
  update();
});

onUpdated(update);
</script>

<template>
  <div class="mind">
    <div class="svg-container">
      <svg ref="svgRef"></svg>
    </div>
    <div class="controls">
      <button @click="zoomIn">放大</button>
      <button @click="zoomOut">缩小</button>
      <button @click="fitToScreen">适应屏幕</button>
    </div>
  </div>
</template>

<style scoped>
.mind {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.svg-container {
  flex: 1;
  background-color: #e8e6e6;
}

.svg-container svg {
  width: 100%;
  height: 100%;
}

.controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
}
.controls button {
  margin-left: 10px;
  box-sizing: border-box;
  padding: 4px 8px;
  background-color: var(--vp-c-brand-1);
  border-radius: 10px;
  color: #fff;
}
</style>
