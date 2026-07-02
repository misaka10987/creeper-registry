+++
title = "常用约定"

[sidebar]
order = 3
+++

本文所记载的规则不是强制性的。违反它们不会影响 creeper 的正常工作。我们建议你尽可能跟随这些规则，这样有助于不同的打包者协同工作和维护。

## 模组支持不同加载器

很多模组都支持在不同的加载器上工作。在打包这样的模组 `foo` 时，你可以如下处理：

- **如果不同加载器的 JAR 文件和依赖都相同：** 
  
  这个模组就和正常的模组一样，不需要特殊处理。记得加上不同加载器的析取依赖。
  
  ```toml
  [[either-dependency]]
  neoforge = "*"
  fabric = "*"
  ```

- **如果不同加载器的 JAR 文件不同：**
  
  为每个加载器新建一个包，例如 `foo-neoforge` 和 `foo-fabric` . `foo-neoforge` 的 `[[install.mc-mod]]` 中写 NeoForge 版的 JAR 文件，Fabric 同理。最后，照常建立一个 `foo` 包，并析取依赖于 `foo-neoforge` 和 `foo-fabric` .
  
  ```toml
  # fabric 同理
  id = "foo-neoforge"
  version = "1.0.0"
  # ...
  [dependencies]
  neoforge = "*"
  
  [[install.mc-mod]]
  blake3 = # ...
  name = # ...
  src = # ...
  len = # ...
  ```
  
  ```toml
  id = "foo"
  version = "1.0.0"
  # ...
  [[either-dependency]]
  foo-neoforge = "=1.0.0"
  foo-fabric = "=1.0.0"
  ```

- **如果不同加载器的依赖不同：**
  
  同样，为每个加载器新建一个包。不同平台都有的依赖定义在 `foo` 中，平台特定的依赖定义在 `foo-neoforge` 等。
  
  ```toml
  id = "foo-neoforge"
  version = "1.0.0"
  # ...
  [dependencies]
  neoforge = "*"
  bar1 = "*"
  ```
  
  ```toml
  id = "foo-fabric"
  version = "1.0.0"
  # ...
  [dependencies]
  fabric = "*"
  bar2 = "*"
  ```
  
  ```toml
  id = "foo"
  version = "1.0.0"
  # ...
  [dependencies]
  baz = "*"
  
  [[either-dependency]]
  foo-neoforge = "=1.0.0"
  foo-fabric = "=1.0.0"
  ```
  
  此时 `foo` 依赖于 `baz` , NeoForge 版本额外依赖于 `bar1` , Fabric 版本额外依赖于 `bar2` .

在上述处理中，`foo` , `foo-neoforge` , `foo-fabric` 等的版本要始终相同。一般在不同平台的版本的 `package.name` 中括注加载器的名称，如 "Foo (NeoForge Edition)".

如果被你依赖的模组是跨平台的，在指定依赖时应该始终指定 `foo = "*"` 而不是 `foo-neoforge = "*"` , 即使你的模组不跨平台。
