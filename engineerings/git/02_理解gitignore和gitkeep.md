# 理解 gitignore 和 gitkeep

`.gitignore` 和 `.gitkeep` 是 Git 的两个特殊文件，它们被用来控制 Git 的行为。

`.gitignore` 文件用于忽略特定的文件或文件夹，这些文件或文件夹不会被提交到 Git 的仓库中。

`.gitkeep` 文件是一个空文件，它被用来创建一个空文件夹，并将其添加到 Git 的仓库中。

## .gitignore

如果文件目录被置灰，就是文件没有被更踪。

```bash
# .gitignore
dist
```

<img src="/images/engineerings/git/01_git.png" style="zoom: 50%;" />

可以发现，针对整个项目中，`dist 无论是文件夹还是文件，都会被忽略掉`。

<hr />

```bash
# .gitignore
/dist
```

可以发现，只有 dist 文件没有被跟踪。

<img src="/images/engineerings/git/02_git.png" style="zoom: 50%;" />

`/ 表示从当前的 .gitignore 文件位置开始。/dist 表示 .gitignore 的同级下去寻找 dist`

<hr />

```bash
# .gitignore
dist/
```

<img src="/images/engineerings/git/03_git.png" style="zoom: 50%;" />

可以发现，只有 dist 文件夹变灰了，而 dist 文件没有变。

`说明在后面添加 /，表示只查找文件夹`。

<hr />

```bash
a/dist/     # 寻找 dist 文件夹
a/dist      # 寻找 dist 文件
```

<img src="/images/engineerings/git/04_git.png" style="zoom: 50%;" />

在 a 文件夹下去寻找 dist 文件夹

<hr />

```bash
*.jpg
```

<img src="/images/engineerings/git/05_git.png" style="zoom: 50%;" />

发现项目下的所有以 .jpg 结尾的文件都没有被跟踪了。

`* 表示匹配所有，但是 / 除外 （这里可能没有体现出来）`

<hr />

```bash
a/*.jpg
```

<img src="/images/engineerings/git/06_git.png" style="zoom: 50%;" />

可以发现只匹配了 1.jpg，但是并没有匹配到 2.jpg。为什么呢? `/`不是匹配所有吗？

```bash
a/*.jpg

# 但是针对 2.jpg 来说，完整的路径就是 a/aa/2.jpg
# * 不能匹配 /, 也就说明了不能匹配 aa/

# 但是为什么 *.jpg 能匹配所有，不是很清楚
```

那么针对上面这种情况，应该怎么处理呢？`**` 就能匹配所有了。

```bash
a/**/*.jpg
```

<img src="/images/engineerings/git/07_git.png" style="zoom: 50%;" />

- `*`不能匹配 / ，但是针对只有一个 `*` 时，就是特殊的。
- `**` 可以匹配 /

```bash
a/**/?.jpg
```

<img src="/images/engineerings/git/08_git.png" style="zoom: 50%;" />

`?`其实就是正则的形式，匹配一个或者零个。

```bash
a/**/*.jpg  # 排除 a 文件夹下的所有 jpg
!a/1.jpg    # 单独拧出 a 文件夹下的 1.jpg 进行跟踪
```

<img src="/images/engineerings/git/09_git.png" style="zoom: 50%;" />

`!` 就是用来单独抽取某一个来进行跟踪。

这种有什么实际用途呢？不好意思，这个可能还是使用的最多的一个字符

在上面的例子中，可以发现，当排除了所有文件，不被跟踪后，就会发现文件夹也不会被跟踪。

## .gitkeep

但是在某些场景中，比如说，uploads 文件夹，保存着用户的图片，我们不需要上传用户的图片到 git 中，但是 uploads 文件夹却是需要上传到 git 中，不然别人拉取代码就会报错。

那么这时候应该怎么解决呢？`.gitkeep`

```bash
a/**/*.*
!*.gitkeep
```

<img src="/images/engineerings/git/11_git.png" style="zoom: 50%;" />

发现 a 文件夹被跟踪了。
