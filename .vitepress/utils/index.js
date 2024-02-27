import path from "node:path";
import fs from "node:fs";

// 判断是否是文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

const DIR_PATH = path.resolve();

// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST = ["index.md", "code"];

// 取差值
const intersections = (arr1, arr2) =>
  Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))));

// 把方法导出直接使用
function getList(params, path1, pathname) {
  // 存放结果
  const res = [];
  // 开始遍历params
  for (let file in params) {
    // 拼接目录
    const dir = path.join(path1, params[file]);
    // 判断是否是文件夹
    const isDir = isDirectory(dir);
    if (isDir) {
      // 如果是文件夹,读取之后作为下一次递归参数
      const files = fs.readdirSync(dir);
      res.push({
        text: params[file],
        collapsed: true,
        items: getList(files, dir, `${pathname}/${params[file]}`),
      });
    } else {
      // 获取名字
      const name = path.basename(params[file]);
      // 排除非 md 文件
      const suffix = path.extname(params[file]);
      if (suffix !== ".md") {
        continue;
      }
      // 去掉后缀名
      let _name = path.parse(name).name;
      res.push({
        text: _name.split("_")[1] ?? _name.split("_")[0],
        // text: _name,
        link: `${pathname}/${_name}`,
      });
    }
  }
  return res;
}

export function generateDirectory(pathname) {
  const dirPath = path.join(DIR_PATH, pathname);
  // 读取 pathname 下的所有文件或者文件夹
  const files = fs.readdirSync(dirPath);
  // 去掉白名单
  const items = intersections(files, WHITE_LIST);
  return getList(items, dirPath, pathname);
}
