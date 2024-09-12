# DTO 验证

```bash
npm install --save class-validator class-transformer
```

```ts
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


// 其使用格式：message 属性 （不是第一个参数，就是第二个参数，具体进去看看类型）
@IsNotEmpty({message: string})

@IsEmail({}, {message: string})

```

## 共用

- @IsNotEmpty()：检查值是不是 ''、undefined、null
- @IsDefined()：检查值是不是 undefined、null
- @IsOptional()：可选的
- @IsIn(['x', 'y'])：枚举
- @IsNotIn()：枚举之外
- @Matches(//, {message: ''})：正则匹配

## 字符串

- @IsString()
- @IsAlpha() 是否只有字母
- @IsAlphanumeric() 是否是字母和数字
- @Contains() 包含某个字母
- @MinLength(2)
- @MaxLength(6)
- @Length(2,6)

## 数字

- @IsNumber() 是否是数字
- @IsPositive() 是必须是正数
- @IsNegative() 是必须是负数
- @Min() 最小值
- @Max() 最大值
- @IsDivisibleBy() 是必须被某个数整除

## 布尔

- @IsBoolean()

## 邮箱

- @IsEmail()

## 时间

- @IsDate()
- @IsDateString() 是 ISO 标准的日期字符串

## 数组

- @IsArray()：数组
- @ArrayContains(['a'])：指定数组里必须包含的值
- @ArrayNotContains(['a'])：指定数组里不能包含的值
- @ArrayMinSize(1)：数组长度最小为 1
- @ArrayMaxSize(5)：数组最大的长度为 5
- @ArrayUnique()：数组元素必须唯一

## 其他

- @IsHexColor()： 十六进制颜色
- @IsHSL()： HSL
- @IsRgbColor()： RGB
- @IsIP()：ip
- @IsPort()：端口
- @IsJSON()：JSON
- @IsMobilePhone('zh-CN')：验证手机号
