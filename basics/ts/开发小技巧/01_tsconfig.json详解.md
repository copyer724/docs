## tsconfig.json 的详解

## 属性列举

::: code-group

```js [顶层属性]
{
  "extends": "",
  "compileOnSave": true,
  "compilerOptions": {}, // 一个复杂的配置，详细
  "files": [], // 指定一个包含相对或绝对文件路径的列表
  "include": [], // 通过匹配需要转换的文件
  "exclude": [], // 忽略include和files中需要转换的文件
  "references": []
}
```

```json [compilerOptions 属性列表]
{
  "compilerOptions": {
    //编译选项
    "allowJS": false, // 允许编译器编译JS，JSX文件
    "checkJs": false, // 	在 .js文件中报告错误。与allowJs配合使用。
    "allowSyntheticDefaultImports": false, //允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。默认值：module === "system" 或设置了 --esModuleInterop 且 module 不为 es2015 / esnext
    "allowUnreachableCode": false, //不报告执行不到的代码错误。
    "allowUnusedLabels": false, //不报告未使用的标签错误
    "alwaysStrict": false, // 在代码中注入'use strict',以严格模式解析并为每个源文件生成 "use strict"语句
    "charset": "utf8", //输入文件的字符集
    "declaration": false, // 生成声明文件.d.ts，开启后会自动生成声明文件
    "declarationDir": "", // 指定生成声明文件存放目录
    "diagnostics": false, // 显示诊断信息
    "extendedDiagnostics": false, //显示详细的诊段信息
    "experimentalDecorators": false, //启用实验性的ES装饰器
    "disableSizeLimit": false, //禁用JavaScript工程体积大小的限制
    "emitBOM": false, //在输出文件的开头加入BOM头（UTF-8 Byte Order Mark）。
    "forceConsistentCasingInFileNames": false, //禁止对同一个文件的不一致的引用
    "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    "isolatedModules": false, //将每个文件作为单独的模块（与“ts.transpileModule”类似）。
    "listEmittedFiles": false, //打印出编译后生成文件的名字
    "listFiles": false, // 编译过程中打印文件名
    "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
    "target": "ES5", // 指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"
    "module": "CommonJS", // 设置程序的模块系统， "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015", "ESNext", "ES2020"，只有 "AMD"和 "System"能和 --outFile一起使用，"ES6"和 "ES2015"可使用在目标输出为 "ES5"或更低的情况下。默认值：target === "ES6" ? "ES6" : "commonjs"
    "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    "jsx": "Preserve", //在 `.tsx`文件里支持JSX： `"React"`或 `"Preserve"`
    "jsxFactory": "React.createElement", //指定生成目标为react JSX时，使用的JSX工厂函数，比如 `React.createElement`或 `h`
    "newLine": "crlf", //当生成文件时指定行结束符： "crlf"（windows）或 "lf"（unix）。
    "noEmit": false, // 不输出文件,即编译后不会生成任何js文件
    "noEmitOnError": false, // 发送错误时不输出任何文件
    "noErrorTruncation": false, //不截短错误消息
    "noFallthroughCasesInSwitch": false, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
    "noImplicitAny": false, // 不允许隐式的any类型,在表达式和声明上有隐含的 any类型时报错
    "noImplicitReturns": false, //每个分支都会有返回值，不是函数的所有返回路径都有返回值时报错
    "noImplicitThis": false, // 不允许this有隐式的any类型
    "noImplicitUseStrict": false, //模块输出中不包含 "use strict"指令
    "noLib": false, //不包含默认的库文件（ lib.d.ts）
    "noResolve": false, //不把 /// <reference``>或模块导入的文件加到编译文件列表。
    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    "noStrictGenericChecks": false, //禁用在函数类型里对泛型签名进行严格检查
    "noUnusedLocals": false, // 若有未使用的局部变量则抛错
    "noUnusedParameters": false, // 检若有未使用的函数参数则抛错
    "lib": [
      //TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
      "DOM",
      "ES2015",
      "ScriptHost",
      "ES2019.Array"
    ],
    "outDir": "./dist", // 指定输出目录
    "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    "preserveSymlinks": false, //不把符号链接解析为其真实路径；将符号链接文件视为真正的文件
    "preserveWatchOutput": false, //保留watch模式下过时的控制台输出
    "removeComments": true, // 删除所有注释，除了以 /!*开头的版权信息
    "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "resolveJsonModule": true, //允许导入扩展名为“.json”的模块
    "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
    "sourceMap": true, // 生成目标文件的sourceMap文件
    "inlineSourceMap": false, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
    "inlineSources": false, // 将代码与sourcemaps生成到一个文件中，要求同时设置了 --inlineSourceMap或 --sourceMap属性
    "declarationMap": true, // 为声明文件生成sourceMap
    "types": [], // 要包含的类型声明文件名列表
    "typeRoots": [], // 声明文件目录，默认时node_modules/@types
    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块（比如 __extends， __rest等）
    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    "strict": true, // 启用所有严格类型检查选项。启用 --strict相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict， --strictNullChecks和 --strictFunctionTypes和--strictPropertyInitialization
    "skipLibCheck": false, //忽略所有的声明文件（ *.d.ts）的类型检查
    "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量.在严格的 null检查模式下， null和 undefined值不包含在任何类型里，只允许用它们自己和 any来赋值（有个例外， undefined可以赋值到 void）
    "strictFunctionTypes": true, // 不允许函数参数双向协变
    "strictPropertyInitialization": true, // 	确保类的非undefined属性已经在构造函数里初始化。若要令此选项生效，需要同时启用--strictNullChecks
    "suppressExcessPropertyErrors": false, //阻止对对象字面量的额外属性检查
    "suppressImplicitAnyIndexErrors": false, //阻止 --noImplicitAny对缺少索引签名的索引对象报错
    "strictBindCallApply": true, // 严格的bind/call/apply检查
    "useDefineForClassFields": true, //详见 https://jkchao.github.io/typescript-book-chinese/new/typescript-3.7.html#usedefineforclassfields-%E6%A0%87%E8%AE%B0%E4%B8%8E-declare-%E5%B1%9E%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6
    "esModuleInterop": true, // 允许module.exports=xxx 导出，由import from 导入.因为很多老的js库使用了commonjs的导出方式，并且没有导出default属性
    "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": {
      // 模块名到基于 baseUrl的路径映射的列表
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      "jquery": ["node_modules/jquery/dist/jquery.min.js"],
      "@/*": ["src/*"] // 别名ts配置
    },
    "rootDirs": ["src", "out"] // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  }
}
```

:::

## allowSyntheticDefaultImports

```javascript
import * as React from "react"; // ts 写法

import React from "react"; // js 写法
```

如果在 ts 中写 js 写法，就会报下面的错误信息，那么该怎么解决呢？

::: danger 错误信息

保存信息：此模块是使用 “export =” 声明的，只能在使用“allowSyntheticDefaultImports”标志时用于默认导入

:::

只需要配置该属性为 true，就能解决了。该属性仅用于类型检查，不影响实际功能。

## tsconfig.json 和 tsconfig.node.json

- tsconfig.json 文件就是对 ts 编译时起作用。
- tsconfig.node.json 是使用 vite 创建的项目时，才存在的。

在 tsconfig.json 中进行引入：

```json
{
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

tsconfig.node.json 的具体内容

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

::: tip
简单的来说，tsconfig.node.json 就是为 vite.config.ts 服务的。
:::

那么为什么会专门创建一个文件来为 vite.config.ts 服务呢？

可以这样理解：vite.config.ts 是运行在服务端的，而项目中的 ts 文件是运行在浏览器中的，所以两个配置量不一样，浏览器有很多兼容。
