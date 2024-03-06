# css 开发小技巧

### grid 布局，边框处理

类似九空格形式，如果给每个格子都加上 border 属性，那么就会造成边框重复，不是想要的，如果处理呢？

```css
.item {
  border: 1px solid #ddd;
  margin-left: -1px;
  margin-top: -1px;
}
```

这样就解决了边框重复的问题。但是也会造成一点点 margin 偏离的问题，这个设置的时候，注意一下即可。
