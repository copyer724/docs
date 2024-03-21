# RESTful 设计风格

是一个编写风格，遵循不遵循，随意。

## api 设计

以前风格

```js
/api/page/aceert; // 新增 post
/api/page/update  // 更新 get
/api/page/delete  // 删除 get
```

resuful 风格

```js
/api/page; // 新增 post
/api/page  // 更新 put
/api/page  // 删除 delete
/api/page  // 列表 get
```

接口名称一样，只是请求方法不一样。

## 版本

## 状态码
