import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import createVitePlugins from './vite/plugins';

// https://vitejs.dev/config/
export default ({ mode, command }: any) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    root: path.join(__dirname, 'src/render'),
    envDir: process.cwd(),
    base: env.VITE_SERVER_BASE,
    assetsInclude: path.resolve(__dirname, 'src/assets/images'),
    // 开发服务器选项 https://cn.vitejs.dev/config/#server-options
    server: {
      port: +env.VITE_SERVER_PORT,
      open: false,
      proxy: {
        '/proxy': {
          target: env.VITE_APP_API_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY == 'true',
          rewrite: (path) => path.replace(/\/proxy/, '')
        },
        '/nanaProxy': {
          target: env.VITE_APP_nana_API_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY == 'true',
          rewrite: (path) => path.replace(/\/nanaProxy/, '')
        }
      },
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
        strict: false
      }
    },

    // 构建选项 https://cn.vitejs.dev/config/#server-fsserve-root
    build: {
      outDir: path.resolve(__dirname, `${env.VITE_BUILD_OUTDIR}`),
      sourcemap: env.VITE_BUILD_SOURCEMAP == 'true',
      emptyOutDir: true,
      target: 'chrome89',
      modulePreload: {
        polyfill: false
      },
      minify: 'esbuild',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2048
    },
    // 删除 console
    esbuild: {
      drop: env.VITE_BUILD_DROP_CONSOLE == 'true' ? ['console', 'debugger'] : ['debugger']
    },
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        '@root': __dirname,
        '@': path.resolve(__dirname, 'src/render')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "@/styles/variables.scss"; @import "@/styles/utils.scss";`
        }
      }
    },
    optimizeDeps: {
      exclude: ['swiper/types']
    }
  });
};
