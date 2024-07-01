import { ConfigEnv, UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  return {
    base: '',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          'white-list': resolve(__dirname, 'white-list.html'),
        },
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => /^li-/.test(tag),
          },
        },
      }),
      viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: mode === 'mock',
        // localEnabled: true,
      }),
      vueJsx(),
    ],
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    server: {
      port: 2000,
      strictPort: true,
      hmr: true,
      host: 'template.jdl.com',
      proxy: {
        '/cpi/mock': {
          target: 'http://localhost:3000/',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/cpi\/mock/, ''),
        },
        // 选项写法
        '/api': {
          // 测试环境后台IP
          target: 'http://manage.jd.com/',
          // target: 'http://devm.jd.com/',
          // 前端测试机器nginx转发
          // 灰度机器
          // target: 'http://uat.ydy-admin.jdl.com/',
          changeOrigin: true,
        },
        // 选项写法
        '/bpi': {
          target: 'http://manage.jdl.com',
          changeOrigin: true,
        },
        // 新后台地址
        '/cpi': {
          // 测试环境后台IP
          // target: 'http://manage.jd.com/',
          // target: 'http://devm.jd.com/',
          // 前端测试机器nginx转发
          target: 'http://manage.jdl.com',
          // 灰度机器
          // target: 'http://uat.ydy-admin.jdl.com/',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, './packages/main') },
        { find: '@w', replacement: resolve(__dirname, './packages/whiteList') },
      ],
    },
  };
};
