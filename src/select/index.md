---
title: 下拉框组件
group:
  title: 进阶组件 # 二级导航名称
  order: 2
nav:
  path: /components/select
  order: 1
---

## 1.基本用法

select组件 支持单选和多选两种模式，默认是单选。多选/单选会在选择完毕后，调用onChange传递数据给父组件
多选支持远程搜索，防抖控制，请求时序控制，加载状态控制等功能
多选支持远程搜索的逻辑封装成自定义hooks，关注点分离，方便在其他组件中使用

## 2. API文档

| 参数                        | 类型       | 默认值 | 说明                         |
| --------------------------- | ---------- | ------ | ---------------------------- |
| `en`                        | `string`   | -      | 搜索下拉框唯一标识符         |
| `icon`                      | `string`   | -      | 默认状态下的icon展示         |
| `placeholder`               | `string`   | -      | 提示内容                     |
| `mode`                      | `string`   | -      | 单选/多选模式                |
| `className`                 | `string`   | -      | 样式覆盖                     |
| `remoteSearchConfiguration` | `object`   | -      | 多选参数配置                 |
| `onChange`                | `function` | -      | 通知父组件更新状态的回调函数 |
|  `rest`                   | `object`   | -      | 透传antdSelect组件props      |

<code src="./demo/basic.tsx" title='支持单选/多选/远程搜索'  ></code>
