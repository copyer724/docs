# 陌生的 css 属性

## clamp()

为了响应式。
clamp (min, precent, max)

```css
.content {
  width: clamp(100px, 30%, 500px)
  /* 兼容转换   */
  width: max(100px, min(30%, 500px))
}
```
