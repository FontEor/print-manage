#
export NODE_OPTIONS=--max_old_space_size=4096
# 安装并启动项目
1. 切换nodeJS版本14
2. yarn install 安装
3. npm run dev 启动项目

# 项目结构
/doc
    涉及知识点文档
/mock
    mock数据目录
/public
    静态文件转发目录
/src/axios
    请求文件目录
/src/axios/format
    响应内容预处理函数目录
/src/less
    所有页面样式存储目录
/src/modules
    页面模块存储目录
/src/types
    类型声明文件目录
    
# 开发与联调
### 开发服务器
http://11.80.23.99:8081
### 接口文档地址
http://11.80.34.175:8081/orgs
http://11.80.34.175:8081/swagger-ui.html
http://manage.jd.com/api/swagger-ui.html#/
### prd文档地址
https://joyspace.jd.com/page/hbsOnaw68dhVNAlx1mks

### Host
127.0.0.1 template.jd.com
11.91.148.62 manage.jd.com #测试环境

# 工具
### [uuid生成器](https://www.uuidgenerator.net/)

# 打包备注
1. 地址问题public editor.html 中的 请求前缀

# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
