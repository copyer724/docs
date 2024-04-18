# tsconfig.json 的详解

## 属性列举

::: code-group

```js [顶层属性]
{
  "extends": "",
  "compileOnSave": true,
  /**
   * 一个复杂的配置，用于规则转换
   */
  "compilerOptions": {},
  /**
   * 指定一个包含相对或者绝对路径的列表
   */
  "files": [],
  /**
   * 哪些文件需要转化
   */
  "include": [],
  /**
   * 哪些文件不需要转化
   */
  "exclude": [],
  "references": []
}
```

```ts [compilerOptions 属性列表]
// 编译选项
{
  compilerOptions: {
    /**
     * 是否允许编译器编译 js、jsx 文件
     */
    allowJS: false,
    /**
     * 在 js 文件中报告错误。与 allowJS 配合使用
     */
    checkJs: false,
    /**
     * 是否允许没有设置导出的模块进入导入。不影响代码输出，仅为了检查类型。
     * 默认值 module = 'system'
     * 或者设置了 --esModuleInterop 且 module 不为 es2015 / esnext
     */
    allowSyntheticDefaultImports: false,
    allowUnreachableCode: false, //不报告执行不到的代码错误。
    allowUnusedLabels: false, //不报告未使用的标签错误
    alwaysStrict: false, // 在代码中注入'use strict',以严格模式解析并为每个源文件生成 "use strict"语句
    charset: "utf8", //输入文件的字符集
    declaration: false, // 生成声明文件.d.ts，开启后会自动生成声明文件
    declarationDir: "", // 指定生成声明文件存放目录
    diagnostics: false, // 显示诊断信息
    extendedDiagnostics: false, //显示详细的诊段信息
    experimentalDecorators: false, //启用实验性的ES装饰器
    disableSizeLimit: false, //禁用JavaScript工程体积大小的限制
    emitBOM: false, //在输出文件的开头加入BOM头（UTF-8 Byte Order Mark）。
    forceConsistentCasingInFileNames: false, //禁止对同一个文件的不一致的引用
    incremental: true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    isolatedModules: false, //将每个文件作为单独的模块（与“ts.transpileModule”类似）。
    listEmittedFiles: false, //打印出编译后生成文件的名字
    listFiles: false, // 编译过程中打印文件名
    tsBuildInfoFile: "./buildFile", // 增量编译文件的存储位置
    target: "ES5", // 指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"
    module: "CommonJS", // 设置程序的模块系统， "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015", "ESNext", "ES2020"，只有 "AMD"和 "System"能和 --outFile一起使用，"ES6"和 "ES2015"可使用在目标输出为 "ES5"或更低的情况下。默认值：target === "ES6" ? "ES6" : "commonjs"
    moduleResolution: "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    jsx: "Preserve", //在 `.tsx`文件里支持JSX： `"React"`或 `"Preserve"`
    jsxFactory: "React.createElement", //指定生成目标为react JSX时，使用的JSX工厂函数，比如 `React.createElement`或 `h`
    newLine: "crlf", //当生成文件时指定行结束符： "crlf"（windows）或 "lf"（unix）。
    noEmit: false, // 不输出文件,即编译后不会生成任何js文件
    noEmitOnError: false, // 发送错误时不输出任何文件
    noErrorTruncation: false, //不截短错误消息
    noFallthroughCasesInSwitch: false, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
    noImplicitAny: false, // 不允许隐式的any类型,在表达式和声明上有隐含的 any类型时报错
    noImplicitReturns: false, //每个分支都会有返回值，不是函数的所有返回路径都有返回值时报错
    noImplicitThis: false, // 不允许this有隐式的any类型
    noImplicitUseStrict: false, //模块输出中不包含 "use strict"指令
    noLib: false, //不包含默认的库文件（ lib.d.ts）
    noResolve: false, //不把 /// <reference``>或模块导入的文件加到编译文件列表。
    noEmitHelpers: true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    noStrictGenericChecks: false, //禁用在函数类型里对泛型签名进行严格检查
    noUnusedLocals: false, // 若有未使用的局部变量则抛错
    noUnusedParameters: false, // 检若有未使用的函数参数则抛错
    lib: [
      //TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
      "DOM",
      "ES2015",
      "ScriptHost",
      "ES2019.Array",
    ],
    outDir: "./dist", // 指定输出目录
    outFile: "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    preserveSymlinks: false, //不把符号链接解析为其真实路径；将符号链接文件视为真正的文件
    preserveWatchOutput: false, //保留watch模式下过时的控制台输出
    removeComments: true, // 删除所有注释，除了以 /!*开头的版权信息
    rootDir: "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    resolveJsonModule: true, //允许导入扩展名为“.json”的模块
    emitDeclarationOnly: true, // 只生成声明文件，而不会生成js文件
    sourceMap: true, // 生成目标文件的sourceMap文件
    inlineSourceMap: false, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
    inlineSources: false, // 将代码与sourcemaps生成到一个文件中，要求同时设置了 --inlineSourceMap或 --sourceMap属性
    declarationMap: true, // 为声明文件生成sourceMap
    types: [], // 要包含的类型声明文件名列表
    typeRoots: [], // 声明文件目录，默认时node_modules/@types
    importHelpers: true, // 通过tslib引入helper函数，文件必须是模块（比如 __extends， __rest等）
    downlevelIteration: true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    strict: true, // 启用所有严格类型检查选项。启用 --strict相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict， --strictNullChecks和 --strictFunctionTypes和--strictPropertyInitialization
    skipLibCheck: false, //忽略所有的声明文件（ *.d.ts）的类型检查
    strictNullChecks: true, // 不允许把null、undefined赋值给其他类型的变量.在严格的 null检查模式下， null和 undefined值不包含在任何类型里，只允许用它们自己和 any来赋值（有个例外， undefined可以赋值到 void）
    strictFunctionTypes: true, // 不允许函数参数双向协变
    strictPropertyInitialization: true, // 	确保类的非undefined属性已经在构造函数里初始化。若要令此选项生效，需要同时启用--strictNullChecks
    suppressExcessPropertyErrors: false, //阻止对对象字面量的额外属性检查
    suppressImplicitAnyIndexErrors: false, //阻止 --noImplicitAny对缺少索引签名的索引对象报错
    strictBindCallApply: true, // 严格的bind/call/apply检查
    useDefineForClassFields: true, //详见 https://jkchao.github.io/typescript-book-chinese/new/typescript-3.7.html#usedefineforclassfields-%E6%A0%87%E8%AE%B0%E4%B8%8E-declare-%E5%B1%9E%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6
    esModuleInterop: true, // 允许module.exports=xxx 导出，由import from 导入.因为很多老的js库使用了commonjs的导出方式，并且没有导出default属性
    allowUmdGlobalAccess: true, // 允许在模块中全局变量的方式访问umd模块
    baseUrl: "./", // 解析非相对模块的基地址，默认是当前目录
    paths: {
      // 模块名到基于 baseUrl的路径映射的列表
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      jquery: ["node_modules/jquery/dist/jquery.min.js"],
      "@/*": ["src/*"], // 别名ts配置
    },
    rootDirs: ["src", "out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  },
};
```

:::

## compilerOptions 选项详细解说

```js
{
  "compilerOptions": {
    /**
     * ========================================
     * Projects: 项目级别
     * ========================================
     */
    /**
     * TS编译器在第一次编译之后会生成一个存储编译信息的文件，
     * 第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度。
     */
    "incremental": true,
    /**
     * 用于启用项目引用和增量构建。
     * 启用后，每个子项目可以独立编译，并生成一个 .tsbuildinfo 文件。
     * 该文件保存了编译状态的增量信息
     */
    "composite": true,
    /**
     * .tsbuildinfo 文件存储位置
     * 增量编译文件的存储位置
     */
    "tsBuildInfoFile": "./.tsbuildinfo",
    /**
     * 在引用复合项目时禁用首选源文件而不是声明文件
     */
    "disableSourceOfProjectReferenceRedirect": true,
    /**
     * 减少编译时的开销
     * 在编辑时选择一个项目时，不进行多项目参考检查
     */
    "disableSolutionSearching": true,
    /**
     * 阻止编译器加载任何通过项目引用（project references）引入的依赖项目
     */
    "disableReferencedProjectLoad": true,

    /**
     * ========================================
     * Language and Environment: 语言和环境
     * ========================================
     */
    /**
     * 指定ECMAScript目标版本 "ES3"（默认），
     * "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"
     */
    "target": "ES5",
    /**
     * 指定一组描述目标运行时环境的捆绑库声明文件。
     * TS需要引用的库，即声明文件;
     * es5 默认引用dom、es5、scripthost;
     * 如需要使用es的高级版本特性，也需要配置，如es8的数组新特性需要引入"ES2019.Array"
     */
    "lib": ['dom'],
    /**
     * 如何处理 jsx 语法
     * preserve: 代码不做处理。一般后面使用 babel 转化
     * react: 将 JSX 转换为 React.createElement 函数调用
     * automatic: typescript 4.1 引入，自动监测环境（React, Preact）进行转化
     * react-jsx： React 17 新的 jsx 转化方式，不在引入 React
     * react-native： 类似 React，有点稍微不同转变，兼容 React native 环境
     */
    "jsx": "preserve",
    /**
     * 是否支持实验性语法装饰器
     */
    "experimentalDecorators": true,
    /**
     * 是否为装饰器生成元数据
     */
    "emitDecoratorMetadata": true,
    /**
     * 指定生成目标为react JSX时，使用的JSX工厂函数，
     * 比如 `React.createElement`或 `h`
     */
    "jsxFactory": "React.createElement",
    /**
     * 自定义的JSX片段工厂函数
     * 在React中，当你使用<></>语法创建一个片段（Fragment）时，
     * 会被转换为React.Fragment或React.createElement(React.Fragment, {})
     */
    "jsxFragmentFactory": "Fragment",
    /**
     * 用于指定JSX标签应该从哪里导入
     * 默认情况下，ts编辑器知道 jsx 来源于 React 库。
     * 若使用了其他的库，就需要指定导入路径
     */
    "jsxImportSource": "preact/jsx-runtime",
    /**
     * 用于指定 React 组件的命名空间
     * 不常用了
     */
    "reactNamespace": "",
    /**
     * 禁用包含任何库文件，包括默认的lib.d.ts
     */
    "noLib": true,
    /**
     * 用于控制类字段的初始化方式
     */
    "useDefineForClassFields": true,

    /**
     * ========================================
     * Modules: 模块
     * ========================================
     */
    /**
     * 设置程序的模块系统，
     * "None"|"CommonJS"|"AMD"|"System"|"UMD"|"ES6"或 "ES2015"|"ESNext"|"ES2020"，
     * 只有 "AMD"和 "System"能和 --outFile一起使用，
     * "ES6"和 "ES2015"可使用在目标输出为 "ES5"或更低的情况下。
     * 默认值：target === "ES6" ? "ES6" : "commonjs"
     */
    "module": "commonjs",
    /**
     * 用于指定输入文件的根目录。
     * 通常用于控制编译过程中输入文件的位置和编译后输出目录的结构。
     * 默认情况下，当前的项目目录会被视为根目录
     */
    "rootDir": "./",
    /**
     * 用于指定模块解析策略。TypeScript 编译器在编译时会根据这个策略来定位模块文件。
     * 两个可能的值：Node 和 Classic。
     *
     * Node：这是默认设置，
     * 当module选项被设置为commonjs、es2015、es2020、esnext、
     * umd、system、amd、es2022或ESNext时，会使用Node.js风格的解析策略。
     * 编译器会在node_modules文件夹和TypeScript类型定义文件（.d.ts）中查找模块。
     * 这通常与Node.js项目兼容。
     *
     * Classic：这是旧的解析策略，用于在某些旧的项目中保持兼容性。
     * 它会根据TypeScript 1.0之前的版本的行为来解析模块。
     * 在Classic模式下，编译器会在项目根目录下和typings文件夹中查找模块
     */
    "moduleResolution": "node10",
    /**
     * 解析非相对模块的基地址，默认是当前目录
     */
    "baseUrl": "./",
    /**
     * 指定模块解析的路径映射
     * paths属性需要与 baseUrl 属性一起使用，baseUrl指定了路径解析的基准目录
     */
    "paths": {
      "@/*": ["src/*"]
    },
    /**
     * 用于指定多个根目录的数组
     */
    "rootDirs": ["src/client", "src/server"],
    /**
     * 指定 TypeScript 编译器查找类型声明文件（.d.ts 文件）的根目录
     * 告诉编译器在哪里可以找到第三方库的类型声明文件。
     */
    "typeRoots": [],
    /**
     * 指定在编译过程中需要包含的类型声明文件的名称。
     * 默认情况下，TypeScript 编译器会查找 node_modules/@types 目录下的类型声明文件。
     * 然而，通过 types 选项，你可以指定应该包含哪些库的类型声明
     */
    "types": [],
    /**
     * typescript 3.5 版本之后
     * 允许开发者在模块中引用 UMD（Universal Module Definition）全局声明
     */
    "allowUmdGlobalAccess": true,
    /**
     * 用于指定编译器在解析模块导入时应考虑的文件后缀名
     * TypeScript 编译器会根据这些后缀名来查找对应的文件
     */
    "moduleSuffixes": ['.ts'、'.tsx'、'.d.ts'],
    /**
     * 允许开发者在非 TypeScript 文件中导入 .ts 或 .tsx 文件
     * 默认情况下，这个选项是关闭的
     */
    "allowImportingTsExtensions": true,
    /**
     * 用于控制 TypeScript 如何解析 package.json 文件中的 exports 字段。
     * auto（默认值）：TypeScript 将尝试自动解析 exports 字段。
     * 如果 exports 字段存在并且有效，TypeScript 将使用它来确定模块的入口点。
     * 如果 exports 字段不存在或无效，TypeScript 将回退到传统的模块解析机制。
     *
     * never：TypeScript 将忽略 exports 字段，并始终使用传统的模块解析机制
     *
     * preserve：TypeScript 将解析 exports 字段，但不会将其解析为实际的文件路径。
     * 相反，它会保留 exports 字段的原始值，并在生成的代码中直接使用这个值
     */
    "resolvePackageJsonExports": true,
    /**
     * 使用包装。解析导入时的Json 'imports'字段。
     */
    "resolvePackageJsonImports": true,
    "customConditions": [],
    /**
     * 允许导入 json 文件
     */
    "resolveJsonModule": true,
    /**
     * 允许通过查找 {file basename}.d.{extension}.ts 形式的声明文件来导入具有未知扩展名的文件。
     * 当你需要导入那些不是标准 .ts 或 .tsx 扩展名的 TypeScript 声明文件时
     */
    "allowArbitraryExtensions": true,
    /**
     * 当指定了这个编译器标志时，
     * TypeScript 编译器会忽略三斜线指令（/// <reference ... />）的解析
     * 这意味着在编译过程中，三斜线指令不会添加新的文件，也不会改变给定文件的顺序。
     */
    "noResolve": true,

    /**
     * ========================================
     * JavaScript Support: 支持 js
     * ========================================
     */
    /**
     * 是否允许编译器编译 js、jsx 文件
     */
    "allowJs": true,
    /**
     * 在 js 文件中报告错误。与 allowJS 配合使用
     */
    "checkJs": true,
    /**
     * 控制 TypeScript 在解析 Node.js 模块时查找 JavaScript 文件的最大深度。
     * 这个选项主要用于优化编译器的性能，
     * 避免在大型项目中因为深度遍历 node_modules 目录而导致编译时间过长。
     */
    "maxNodeModuleJsDepth": 1,

    /**
     * ========================================
     * Emit: 生成
     * ========================================
     */
    /**
     * 生成声明文件.d.ts，开启后会自动生成声明文件
     */
    "declaration": true,
    /**
     * 为 .d.ts 生成 sourcemap 文件
     */
    "declarationMap": true,
    /**
     * 仅生成 .d.ts 文件，不生成 js 文件
     */
    "emitDeclarationOnly": true,
    /**
     * 为 js 文件生成 source map 文件
     */
    "sourceMap": true,
    /**
     * 生成文件内的 source map 文件
     */
    "inlineSourceMap": true,
    /**
     * 用于指定将多个 TypeScript 文件编译到一个单独的 JavaScript 文件中的输出文件路径
     */
    "outFile": "./",
    /**
     * 用于指定编译后的 JavaScript 文件的输出目录
     * 以及可能生成的声明文件 .d.ts 和映射文件 .map
     */
    "outDir": "./",
    /**
     * 删除所有注释
     */
    "removeComments": true,
    /**
     * 不输出文件,即编译后不会生成任何js文件
     */
    "noEmit": true,
    /**
     * 通过tslib引入helper函数，文件必须是模块
     */
    "importHelpers": true,
    /**
     * 用于控制如何处理那些只用作类型而非值的导入。
     * 这个选项可以帮助你减少生成的 JavaScript 代码中的未使用导入，从而优化输出
     *
     * remove：移除所有仅用作类型的导入。这是优化输出代码大小的常用选择。
     * preserve：保留所有导入，即使它们仅用作类型。这是保持源代码和输出代码一致性的选择。
     * error：如果导入仅用作类型，则引发编译错误。这可以帮助你识别并修复那些可能不必要的导入。
     */
    "importsNotUsedAsValues": "remove",
    /**
     * 主要用于支持 ES3 和 ES5 目标中的迭代器和生成器协议
     */
    "downlevelIteration": true,
    /**
     * 它用于指定源代码的根目录路径, 生成的 source map 文件中表示源代码的位置
     */
    "sourceRoot": "",
    /**
     * mapRoot 用于指定生成的 source map 文件的输出目录
     */
    "mapRoot": "",
    /**
     * 编译器会在生成的 JavaScript 文件的末尾附加一个数据 URL
     */
    "inlineSources": true,
    /**
     * 用于控制是否在编译输出的 UTF-8 文件头部加上 BOM（Byte Order Mark）标志
     */
    "emitBOM": true,
    /**
     * 新起一行
     */
    "newLine": "crlf",
    /**
     * 它用于控制是否在编译输出中保留带有 @internal 注解的代码
     */
    "stripInternal": true,
    /**
     * 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
     */
    "noEmitHelpers": true,
    /**
     * 当该选项设置为 true 时，如果在编译过程中遇到任何错误，
     * TypeScript 编译器将不会生成任何输出文件（如 .js 或 .d.ts 文件）
     */
    "noEmitOnError": true,
    /**
     * 用于控制在编译过程中是否保留 const enum 类型的枚举
     */
    "preserveConstEnums": true,
    /**
     * 用于指定生成的 .d.ts 声明文件的输出目录
     * 默认的与对应的 .ts 文件相同的目录
     * 将声明文件与实现文件分开存放时，以便于管理和发布
     */
    "declarationDir": "dist/types",
    /**
     * 用于处理 TypeScript 代码中的 import 语句
     * 使用 preserveValueImports 可以确保这些 import 语句不会被编译器错误地消除，
     * 从而避免运行时错误
     */
    "preserveValueImports": true,

    /**
     * ========================================
     * Interop Constraints: 完整性约束
     * ========================================
     */
    /**
     * 将每个文件作为单独的模块
     * 不依赖其他的导入
     */
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    /**
     * 用于处理 ES6 模块默认导入的语法
     * 在 ts 中使用 es6 语法来导入一个 cjs，就会报错。
     * 设置为 true, 就能正常支持
     */
    "allowSyntheticDefaultImports": true,
    /**
     * 用于指定在导入默认导出时是否应将其转换为具名导出或命名空间导入
     */
    "esModuleInterop": true,
    /**
     * 保留符号链接（symlinks）在模块解析过程中的原始路径
     */
    "preserveSymlinks": true,
    /**
     * 禁止对同一个文件的不一致的引用
     */
    "forceConsistentCasingInFileNames": true,

    /**
     * ========================================
     * Type Checking: 类型检查
     * ========================================
     */
    /**
     * 启用严格模式
     */
    "strict": true,
    /**
     * 不允许隐式的any类型,在表达式和声明上有隐含的 any类型时报错
     */
    "noImplicitAny": true,
    /**
     * 用于启用严格的空值检查
     * TypeScript 编译器会执行更严格的空值检查，
     * 确保变量在使用前已经被正确地初始化，
     * 并且不会被意外地赋值为 null 或 undefined
     */
    "strictNullChecks": true,
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}

```

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
