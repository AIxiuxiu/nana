# 安娜

## 环境搭建

### 安装 Node 环境
下载最新稳定版本安装即可（node18 以上版本）
安装 node.js [下载地址](https://nodejs.org/zh-cn/download/)https://nodejs.org/zh-cn/
打开命令端输入 `node -v 和 npm -v` 打印版本号即安装成功

### 安装依赖

npm 默认和 node 一起安装，但使用时需要代理，不然有些可能无法下载，推荐使用[yarn](https://yarn.bootcss.com/)
建议使用稳定版 `v1.22.17`，不要使用2版本

```shell
# 安装yarn
npm install -g yarn
# 查看版本
yarn -v
```

## 启动

```shell
# web端启动
yarn start
# electron端启动
yarn dev
```

## 打包

```shell
# 打包桌面端，测试环境直接发布
yarn deploy:electron
# 打包web端并发布到测试
yarn deploy
# 打包依赖分析
yarn visualizer
# 调试打包electron
yarn build:electron
```

## 目录

```
├── dist/           // 打包后的项目文件
├── publish/        // 不会被打包处理的静态资源
└── src/render
  ├── apis/           // 接口请求目录
  ├── assets/         // 静态文件目录：包含字体、图标、图片、样式等静态资源
  ├── components/     // 公共组件目录
  ├── directives/     // 全局指令目录
  ├── hooks/          // 全局hooks目录
  ├── layout/         // 布局组件目录
  ├── mock/           // 模拟数据mock目录
  ├── router/         // 路由配置目录
  ├── store/          // 状态管理vuex目录
  ├── types/          // 类型声明目录
  ├── style/          // 通用 CSS 目录
  ├── utils/          // 工具函数目录
  ├── views/          // 页面组件目录
  ├── App.vue         // 页面入口文件
  └── main.ts         // 主入口
├── env.d.ts        // vue声明
├── index.html      // 入口页面
├── .env.*          // 配置文件
├── .eslintrc.js    // eslint配置
├── .prettierrc     // perttier配置
├── .stylelintrc    // stylelint配置
├── tsconfig.json   // TypeScript 配置文件
├── vite.config.ts  // Vite 配置文件
├── package.json    // 项目基本信息和依赖
└── README.md       // 项目说明

```

## 命名规范

一般文件夹命名使用 kebab-case 命名
局通用的组件放在 /src/components 下使用单词大写开头 (PascalCase)， 其它.vue 文件统一大写开头（Pascal case）

除 index.vue 之外，其他.vue 文件统一用 PascalBase 风格

单文件组件的文件名应该要么始终是单词大写开头 (PascalCase)

### 测试环境

web端测试地址： http://test.nana.net/qjkhdg

安娜下载地址，最新版本0.0.1-3

正式
Mac：https://dl.nana.net/qjkhdg/nana.dmg
Windows：https://dl.nana.net/qjkhdg/nana.exe

公测
Mac： https://xser.nana.net/qjkhdg/nana.dmg 
Windows： https://xser.nana.net/qjkhdg/nana.exe 

测试
Mac：http://test.nana.net/qjkhdgtest/nana.dmg
Windows：http://test.nana.net/qjkhdgtest/nana.exe

## 其他

[vue3 文档](https://v3.cn.vuejs.org)
[Vue3 One Piece](https://vue3js.cn)
[风格指南](https://v3.cn.vuejs.org/style-guide/)

[typescript 文档](https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html)
[TypeScript 入门教程](https://ts.xcatliu.com)

[做了一夜动画，就为让大家更好的理解 Vue3 的 Composition Api](https://mp.weixin.qq.com/s/UZGnk8vhyXuSUFhH6nXHTA)
[Vue2.x Vue3.0 dom diff 算法源码分析+动图展示](https://segmentfault.com/a/1190000023774485)
[Vue3 的 Proxy 能做到哪些精确的拦截操作？原理揭秘](https://zhuanlan.zhihu.com/p/148937064)
[Vue3.x 知识图谱](https://gitee.com/jishupang/vue3-knowledge-map)

## 错误
windows安装依赖yarn报错，Error Windows Script Host 
选中electron-builder.js->右键单击->打开->选择其他应用程序->勾选框“始终使用此应用程序”->并找到您的nodejs（通常是C:/ProgramFiles/nodejs/node.exe）
