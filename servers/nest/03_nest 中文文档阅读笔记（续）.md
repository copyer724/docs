# nest 中文文档阅读笔记（续）

### 动态模块

动态模块只是在运行时创建的模块，具有与静态模块完全相同的属性，以及一个额外的名为 module 的属性

```ts{4}
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [ConfigModule.register({ folder: "./config" })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```ts
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

@Module({})
export class ConfigModule {
  // register 返回动态模块
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
```
