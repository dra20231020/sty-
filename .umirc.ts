import { defineConfig } from "dumi";

export default defineConfig({
  title: "STY UI", // 站点名称
  mode: "site",
  outputPath: "doc-site", // 输出文件夹
  exportStatic: {}, // 后续会部署到 github pages 直接全部生成静态页面 不走前端路由
  dynamicImport: {}, // 拆包 站点过大时可以优化首屏加载速度
  alias: {
    "@": "/src",
  },
   transpile: {
    exclude: [/node_modules\/pdfjs-dist\//], // 避免转译 pdfjs-dist
  },

  //配置别名
  // navs: [
  //   // { title: "GitHub", path: "https://github.com/umijs/dumi" },
  //   {
  //     title: "我有二级导航",
  //     children: [
  //       { title: "第一项", path: "/card" },
  //       { title: "第二项", path: "/guide" },
  //     ],
  //   },
  // ],
});
