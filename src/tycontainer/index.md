---
title: TyBox 通用容器 
group: 
  title: 基础组件 # 一级导航名称
  order: 1 
nav:
  path: /components/tycontainer
  order: 4
---
---
# 单独配置名称
nav: 名称
# 同时配置名称和顺序，order 越小越靠前，默认为 0
nav:
  title: 名称
  order: 1
  # 单独配置二级导航名称
  second: 父级名称
  # 同时配置二级导航名称和顺序，order 越小越靠前，默认为 0
  second:
    title: 父级名称
    order: 1
---

<code src="./demo/basic.tsx"></code>
