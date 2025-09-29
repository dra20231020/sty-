---
title: SearchDefault 搜索默认状态组件
group: 
  title: 基础组件 # 一级导航名称
  order: 1 
nav:
  path: /components/search-default
  order: 3
---
## 1. 特性

用于展示搜索默认状态卡片组件，支持自定义卡片内容。

## 2. API文档

| 参数                | 类型        | 默认值 | 说明                    |
| ------------------- | ----------- | ------ | ----------------------- |
| `icon`              | `ReactNode` | -      | 自定义图标              |
| `onclick`           | `function`  | -      | 点击事件操作 ｜         |
| `placeholder`       | `string`    | -      | 提示内容                |
| `value`             | `string`    | -      | 组件内部状态            |
| `className`         | `string`    | -      | 卡片样式类名            |
| `tipOption`         | `object`    | -      | antd文字提示组件原有API |

<code src="./demo/basic.tsx" title='搜索默认状态'  ></code>
