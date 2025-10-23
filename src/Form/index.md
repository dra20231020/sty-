---
title: Form 表单组件
group:
  title: 进阶组件 # 二级导航名称
  order: 2
nav:
  path: /components/Form
  order: 2
---

## 1.基本用法

Form基础表单组件 支持表单配置，表单校验，表单提交，采用组件状态和UI分离模式，后续增加表单联动，动态增删字段等功能

## 2. API文档

| 参数       | 类型           | 默认值 | 说明                         |
| ---------- | -------------- | ------ | ---------------------------- |
| `form`     | `FormInstance` | -      | 表单实例                     |
| `children` | `React.Node`   | -      | 子组件                       |
| `onFinish` | `Function`     | -      | 表单提交回调                 |
| `type`     | `string`       | -      | 表单控件类型                 |
| `name`     | `string`       | -      | 表单字段                     |
| `rules`    | `obj[]`        | -      | 表单字段校验规则             |
| `label` | `string`     | -      | 表单控件标签名 |

<code src="./demo/basic.tsx"></code>

<!-- <API src="./index.tsx"></API>   -->
