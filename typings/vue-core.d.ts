/*
 * @Description: vue相关声明
 * @Author: ahl
 * @Date: 2021-09-29 10:43:20
 * @LastEditTime: 2023-04-19 10:21:22
 */

import dayjs from 'dayjs';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $dayjs: typeof dayjs;
    $img: (name: string) => string;
    $ossImg: (imgUrl: string, width?: number, height?: number, mode?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed') => string;
    $const: { roadshowCover: string };
  }
}
