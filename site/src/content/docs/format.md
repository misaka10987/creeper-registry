+++
title = "格式"
+++

:::caution[不稳定]
在 creeper 达到稳定版本 (v1.0.0) 之前，这里描述的包文件的格式可能会变化，兼容性不能保证。
:::

creeper 包采用一个 [TOML](https://toml.io/cn/v1.0.0) 文件来配置。打包者通过编辑包文件来指导 creeper 执行不同的操作。

## 标识符与版本

所有包都要有一个 **标识符** ，这是用来将它们与其他包区分开的唯一凭据。标识符 `id` 是小写 ASCII 字母开头且仅含有 ASCII 小写字母，数字，下划线 `_` , 或连字符 `-` 的文本。标识符不能与其他包相同。

creeper 包的版本，在格式和语义上，都服从 [语义化版本号](https://semver.org/lang/zh-CN/) 标准。<strong>版本号应当与上游严格一致，</strong>而不是用来标记包文件的版本。

**修订号 `rev`** 被保留，用于处理「给上游的同一个版本多次打包」的情况。由于相关功能尚未实现，请将其设为 `0` , 或直接省略这个字段。

```toml
id = "helloworld"
version = "0.1.0"
# rev = 0
```

标识符和版本还决定了包文件应该放置在哪里。假设 `$root` 是所有包文件的根目录（对 creeper-registry 来说，这是仓库下的 `package` 文件夹；如果你在使用本地注册源，这就是你的 `file://` URL 所指向的位置），并且你的包有 `$id` 和 `$version` , 那么它应该放在这里：

```shell
$root/${id:0:2}/${id:2:2}/$id/$version/0.toml
```

比如我们示例中的包 `helloworld@0.1.0` 就应该放在 `$root/he/ll/helloworld/0.1.0/0.toml` .

## 关于包的信息

你可以在 `[package]` 章节中额外提供一些与包相关的信息。这些信息不会影响依赖解析或安装这个包时的行为。

| 键名            | 解释                                                             |
| ------------- | -------------------------------------------------------------- |
| `name`        | 决定这个包以什么名称来显示。与标识符不同，这可以是任意字符串（UTF-8 编码）。                      |
| `authors`     | 一个字符串构成的数组，表示 **软件的作者**（如果你是打包者，请不要与你本人混淆）。可以在名字之后附上邮箱。        |
| `description` | 一段简短的介绍。                                                       |
| `license`     | 这个包（上游）的发布许可证，需要 [SPDX 许可证表达式](https://spdx.org/licenses/) 格式。 |

```toml
[package]
name = "Hello, world!"
authors = ["misaka10987 <misaka10987@outlook.com>"]
description = "A simple *Hello, world!* package"
license = "MIT"
```

## 依赖

通过定义 **依赖** ，creeper 可以自动化处理不同包之间的关系。模组对加载器 API 的依赖，模组对其前置模组的依赖，或者光影包对光影 API 的依赖都在这里指定。

```toml
[dependencies]
vanilla = "=1.21.1"
```

`[dependencies]` 章节的每一个键值对指定一个依赖。其中，键名是依赖的包的标识符，而对应的值指定需要的版本范围。版本约束由逗号隔开的多个比较运算符和版本构成，与 [Cargo](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#version-requirement-syntax) 的格式相同。

### 冲突

有时候，情况并不是你的包需要另一个包才能工作。相反，它和特定的包同时安装，会产生错误。你可以通过指定 **冲突** 来让 creeper 避免同时安装会造成问题的包。

```toml
[[comflicts]]
optifine = "*"
```

一个冲突和依赖一样，都是标识符和版本约束的键值对，定义了当前的包与冲突包的指定版本区间不能共存。

### 任一

你也可以指定依赖于一组包当中的任意一个，而不关心具体是哪个包（比如，你打包的模组 JAR 文件在 NeoForge 和 Fabric 都可以加载）。creeper 在 **任一** 数组中的每张表格挑选一个条目，作为依赖。

```toml
[[either-dependency]]
neoforge = "21"
fabric = "0.19"
```

请注意，这一组包中 **完全可能有多个包被同时安装**（只要它们不互相冲突）。如果你希望的是「有且仅有一个包」，则需要配合指定冲突来实现。

## 安装

包文件中的 `[install]` 章节告诉 creeper 如果要安装这个包，需要哪些操作。

:::note[TODO]

这篇文档并不完整，这里列出的只是最常用的字段。

:::

### 工件 (Artifact)

我们在此需要引入一个新概念。无论安装什么，一个很常见的操作是将指定文件放到指定位置。为了让所有用户取得一致的文件，并尽量减少传输，creeper 使用 **工件 (Artifact)** 这一概念来抽象文件。

| 键名       | 解释                                                   |
| -------- | ---------------------------------------------------- |
| `blake3` | [BLAKE3](https://github.com/BLAKE3-team/BLAKE3) 校验和。 |
| `name`   | 文件名。这个名称对 creeper 的行为没有任何影响，仅用于显示。                   |
| `src`    | 下载文件的 URL.                                           |
| `len`    | 文件的大小（字节数）。                                          |
| `sha1`   | 可选的 SHA-1 校验和。                                       |
| `sha256` | 可选的 SHA-256 校验和。                                     |
| `md5`    | 可选的 MD5 校验和。                                         |

```toml
blake3 = "d61152a1e1a3092548460179b02f76440890a421c11f93bf7dfbad2f574f58af"
name = "minecraft.jar"
src = "https://piston-data.mojang.com/v1/objects/30c73b1c5da787909b2f73340419fdf13b9def88/client.jar"
len = 26836906
sha1 = "30c73b1c5da787909b2f73340419fdf13b9def88"
```

你不需要手动检查文件的长度与校验和。`creeper tool download <url>` 命令可以从指定的 URL 下载文件，自动计算这些信息，以 TOML 形式生成工件。

### MC 命令行参数

`mc-flag` 数组中的字符串将在游戏启动时传递。

### 模组，资源包，光影包

`mc-mod` 数组中的工件会放置到游戏的 `mods` 文件夹中，就像手动操作一样。

```toml
[[install.mc-mod]]
blake3 = "0121f52b53af9cea6e00b14362617a5a1b9bc75fa92c69d51c96a0815ad25703"
name = "sodium-neoforge-0.6.13+mc1.21.1.jar"
src = "https://cdn.modrinth.com/data/AANobbMI/versions/Pb3OXVqC/sodium-neoforge-0.6.13%2Bmc1.21.1.jar"
len = 1162994
```

`resource-pack` , `shader-pack` 数组中的工件会放置到游戏的 `resourcepacks` , `shaderpacks` 文件夹中。

## 附：配置格式示例

```toml
id = "helloworld"
version = "0.1.0"

[package]
name = "Hello, world!"
authors = ["misaka10987 <misaka10987@outlook.com>"]
description = "A simple *Hello, world!* package"
license = "MIT"

[dependencies]
vanilla = "=1.21.1"
sodium = "*"

[[conflicts]]
optifine = "*"

[[either-dependency]]
neoforge = "21"
fabric = "0.19"

[[install.mc-mod]]
blake3 = "8621517971027dd81f501b01da824ea75c2b0b712b07683babfa3e5a3a10af21"
name = "iris-1.8.8+mc1.21.1.jar"
src = "https://cdn.modrinth.com/data/YL57xq9U/versions/oXIoDcGE/iris-neoforge-1.8.8%2Bmc1.21.1.jar"
len = 2437216

[[install.shader-pack]]
blake3 = "8bc331ee97e067ffdc11aaa13f54619b9bdd907a10d532b7824b6e696e936145"
name = "BSL_v10.1.3.zip"
src = "https://cdn.modrinth.com/data/Q1vvjJYV/versions/hIibTfxn/BSL_v10.1.3.zip"
len = 1127026

```
