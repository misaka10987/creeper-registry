+++
title = "NeoForge 的版本问题"

[sidebar]
order = 4
+++

你或许会看到像 `26.1.8589934668` 这样在 NeoForge 官方并不存在并且数字巨大的版本号。这是因为 NeoForge 有时候使用四个数字，而非语义化版本号的三个来标识版本。我们对这种情况作了特殊处理：具体来说，如果 NeoForge 版本是 $a.b.c.d$ , 我们会把它映射到

$$
a.b.(2^{32} \times c + d)
$$

（也就是前两位不变，将后两位版本号 $c$ 和 $d$ 看作 32 位整数，并把 $c$ 放在 64 位的高 32 位，$d$ 放在低 32 位组成 Patch 部分）。

你可以使用 `nf-version` 命令行工具来转换版本号格式。

```shell
creeper tool nf-version 26.1.8589934668 # 26.1.2.76
creeper tool nf-version --encode 26.1.2.76 # 26.1.8589934668
```
