---
title: Card 内容卡片
group: 
  title: 基础组件 # 一级导航名称
  order: 1 
nav:
  path: /components/card
  order: 2
---

## 1. 特性

用于展示详情数据，结构固定，卡片内容可自定义，响应式布局

## 2. API文档

| 参数                | 类型        | 默认值  | 说明                    |
| ------------------- | ----------- | ------- | ----------------------- |
| `type`              | `string`    | -       | 页面跳转的类型判断      |
| `onclick`           | `function`  | -       | 卡片点击事件操作 ｜     |
| `isHeaderShowTip`   | `boolean`   | `false` | 是否显示头部文字提示    |
| `data`              | `object`    | -       | 卡片内容数据            |
| `headerTipIcon`     | `ReactNode` | -       | 头部文字提示图标        |
| `placement`         | `string`    | `top`   | 卡片提示图标位置        |
| `headerRightImgSrc` | `string`    | -       | 卡片头部右侧图片        |
| `className`         | `string`    | -       | 卡片样式类名            |
| `tipOption`         | `object`    | -       | antd文字提示组件原有API |

<code src="./demo/basic.tsx" title='内容卡片'  ></code>
