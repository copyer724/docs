# wechat 邂逅

## 页面跳转

- `wx.switchTab` 主动切换底部导航栏
- `wx.reLanuch` 关闭所有页面，打开新的页面
- `wx.redirectTo` 关闭当前页面，跳转到应用的某个页面
- `wx.navigateTo` 保留当前页面，跳转到某个应用内的页面（非 tabbar 页面）
- `wx.navigateBack` 关闭当前页面， 返回上一级或多级页面

## 事件处理

### target 与 currentTarget

- `target` : 触发事件的元素
- `currentTarget`：处理事件的元素

::: tip 巧记

- 针对同一个节点，两个对象中的内容是一致的
- 针对不同节点：

```html
<view bindtap="handleBtn" id="outer">
  <view id="inner">inner</view>
</view>
```

点击 inter，target 就是 inner, **触发**事件的元素（你操作那个元素就是那个元素）。

执行 handleBtn, currentTarget 就是 outer, **处理**事件的元素（可能存在冒泡或者捕获的机制，对元素进行操作，但是操作的事件，却不是在自身）。

> `target` 事件触发对象， `currentTarget` 事件处理对象

:::

## 生命周期

应用(优先级从前到后)：

- `onLaunch`: 小程序初始化完成时触发，全局只触发一次
- `onShow`: 小程序启动，或从后台进入前台显示时触发
- `onHide`: 小程序从前台进入后台时触发

页面(优先级从前到后)：

- `onLoad`: 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数
- `onShow`: 页面显示/切入前台时触发。
- `onReady`: 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互.
- `onHide`: 页面隐藏/切入后台时触发 (switchTab / navigateTo), **当前路由还在路由栈中**
- `onUnload`: 页面卸载时触发（redirectTo / navigateBack）, **当前路由不在路由栈中**

**官方示意流程图：**

<img src="/images/frames/mini/05_wx.png" style="zoom: 50%;" />
