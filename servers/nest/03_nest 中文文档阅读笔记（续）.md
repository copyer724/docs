# nest 中文文档阅读笔记（续）

## 动态模块

### 分析

在了解*动态模块*之前，肯定就需要先了解*静态模块绑定*（常用的模块方式）

::: tip 小知识

- 何为模块：模块定义了一组组件，如*提供者*和*控制器*，它们作为整个应用程序的模块部分相互配合。
- 何为宿主模块：简单举例，_UsersModule_ 是 _UsersService_ 的宿主模块。
- 何为消费模块：一个模块的 Service 使用了另外一个模块的 Service，称其为消费模块

:::

`静态模块绑定`：Nest 需要将模块连接在一起,所需的所有信息已经在宿主模块和消费模块中*声明*。（简单理解，就是前端中 `import` 关键词的静态分析）。

::: warning 静态模块绑定特点
*消费模块*没有机会去影响*宿主模块*中的提供者配置（pure）。
:::

但是往往就会存在一种情况，有些提供者的配置，需要由消费模块来提供，调用相同的 API，产生不一样的结果。那么这时候动态模块，就可以实现类似功能。（类似，，前端中的**插槽**）。

::: tip 动态模块的实际作用
*动态模块*提供了一个 API，允许将一个模块导入到另一个模块中，并在导入时自定义该模块的属性和行为。
:::

### 代码案例及理论

动态模块：已读取配置模块为例

::: code-group

```ts [AppModule]
import { ConfigModule } from "./modules/config/config.module";

@Module({
  imports: [ConfigModule.register({ folder: "../../../config" })], // [!code error]
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```ts [ConfigModule]
import { Module, DynamicModule } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { CONFIG_OPTIONS_TOKEN } from "src/common/constants";

@Module({})
export class ConfigModule {
  static register(options: Record<string, any>): DynamicModule {
    // [!code warning]
    return {
      module: ConfigModule,
      providers: [
        { provide: CONFIG_OPTIONS_TOKEN, useValue: options }, // [!code error]
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
```

```ts [ConfigService]
import { Injectable, Inject } from "@nestjs/common";
import { EnvConfig } from "./interfaces/index.interface";
import * as process from "process";
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { CONFIG_OPTIONS_TOKEN } from "src/common/constants";

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(
    @Inject(CONFIG_OPTIONS_TOKEN) // [!code error]
    private readonly configOptions: { folder: string } // [!code error]
  ) {
    /**
     * 假设配置文件目录 config/.env.development 或者 config/.env.production
     * 组装完整路径
     * 读取配置文件信息
     */
    const filePath = `.env.${process.env.NODE_ENV || "development"}`;
    const envFile = path.resolve(__dirname, configOptions.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  /**
   *获取配置信息
   */
  getAll(): EnvConfig {
    return this.envConfig;
  }
}
```

:::

**AppModule**

1. 导入配置模块 `ConfigModule`
2. ConfigModule 是一个普通的类，但是具有一个静态方法 `register`, 调用该方法，返回一个 `DynamicModule`类型的动态模块。
3. register 方法接受输入参数，进行配置。

**ConfigModule**

1. 定义一个具有 register 静态方法的类。
2. 对 register 静态方法的参数，进行`自定义提供者`，进行 IOC 容器初始化，为了在 ConfigService 中使用。
3. register 的返回值是一个对象，**其对象中必须包含 module 属性，其值为 module 类名**，其他属性与静态模块保持一致
4. 自定义提供者 provide 采用的字符串形式，又因为在后面 Service 中要使用，抽成了一个常量。

::: info 动态模块的返回值
动态模块只是在运行时创建的模块，具有与静态模块完全相同的属性，以及一个额外的名为 module 的属性。

其中 module 属性是必选项，其他的是可选项。
:::

**ConfigService**

1. 注入 ConfigModule 中的自定义提供者，获取配置信息
2. 然后根据配置信息，读取文件内容，保存下来（简单的模拟逻辑）。
