# dataurl 和 base64 的区别

### url 和 dataurl 的区别

- url: 资源定位符，请求网络地址，拿取对应的资源信息
- dataurl: 临时的 url, 也就是把资源信息（代码什么的）放到地址上，不用通过请求直接获取资源

https://developer.mozilla.org/zh-CN/docs/Web/URI/Schemes/data

还需要理解一下

dataurl 格式：

```ts
data:[<mediatype>][;base64],<data>
```
