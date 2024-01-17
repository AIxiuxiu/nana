const imgModules = import.meta.glob<{ default: string }>('../assets/images/**/*', { eager: true });

/**
 * 使用图片
 * @param name 图片名称
 */
export default function useImage(name: string) {
  const imgPath = `../assets/images/${name}`;
  if (imgModules[imgPath]) {
    return imgModules[imgPath].default;
  } else {
    return '';
  }
}
