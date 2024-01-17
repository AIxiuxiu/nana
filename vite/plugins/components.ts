import Components from 'unplugin-vue-components/vite';

/**
 * 组件自动按需导入
 */
export default function createComponents() {
  return Components({
    dts: true,
    dirs: ['components'],
    exclude: ['VContextmenu', 'VLoading']
  });
}
