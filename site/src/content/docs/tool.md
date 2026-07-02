+++
title = "使用工具"

[sidebar]
order = 2
+++

你不用始终手动编写 TOML 包文件。creeper 提供了 `pack-nf-mod` 和 `pack-fabric-mod` 这两个命令行工具，从 NeoForge / Fabric 的模组 JAR 文件中自动读取元数据，并生成符合要求的 creeper 包。

```shell
creeper tool pack-nf-mod https://cdn.modrinth.com/data/AANobbMI/versions/Pb3OXVqC/sodium-neoforge-0.6.13%2Bmc1.21.1.jar
creeper tool pack-fabric-mod https://cdn.modrinth.com/data/AANobbMI/versions/u1OEbNKx/sodium-fabric-0.6.13%2Bmc1.21.1.jar
```

你需要提供模组的下载 URL（打包以后 creeper 就从这个 URL 下载文件），然后跟随交互式操作即可。

## 手动修正

需要注意的是，通过命令行工具自动打包的文件，很可能不会正常工作。手动审核一遍包文件，并在需要时修正错误，是绝对有必要的。

### 标识符

NeoForge 和 Fabric 都有自己的模组标识符系统 ( `modId` ), 但这些标识符不一定与 creeper / creeper-registry 中的吻合。

- 将 `minecraft` 修正为 `vanilla` .

### 缺失的包

如果你发现模组所指定的某些依赖 / 冲突项在还没有被 creeper-registry 收录，这是很常见的现象。creeper 的工作逻辑比模组加载器更严格一些，只要找不到所指定的依赖 / 冲突 / 析取依赖的标识符，就会报错。

- 如果必要的依赖项没有收录，显然，由于模组没有它就不能工作，你不能跳过这一条目继续打包，可以考虑先去打包依赖项；

- 如果冲突项没有被收录，你可以选择去打包冲突的包，也可以暂时注释掉这个冲突项。

### 版本范围问题

很多模组使用的版本约束符合 creeper 要求的 [语法](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#version-requirement-syntax) ，但具有不一样的语义。例如，模组必须在 Minecraft 1.21.1 运行，并为 `vanilla` 指定了 `1.21.1` 作为依赖。但是，约束 `1.21.1` 在语义上等同于 `>=1.21.1, <2.0.0` , 而不是只允许 1.21.1 这一个版本。这种情况就需要将 `1.21.1` 手动修改为 `=1.21.1` .

另一个可能的问题来自 [先行版本 (Pre-release)](https://semver.org/lang/zh-CN/#spec-item-9) . 默认情况下，如果你的版本约束不含先行版本号，就永远不会匹配带有先行版本号的版本，即使它位于正确的区间。如果这和你的期望不一致，你需要手动编辑版本约束中的先行版本号。
