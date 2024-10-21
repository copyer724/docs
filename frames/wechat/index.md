# 微信小程序

- [wechat 邂逅](./00_wechat%20邂逅.md)
- [wx.request 拦截器实现](./01_wx.request%20拦截器实现.md)
- [理解登录流程](./02_理解登录流程.md)

## api 授权

https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html

- 部分接口需要经过用户授权同意才能调用
- 开发者可以使用 `wx.getSetting` 获取用户当前的授权状态
