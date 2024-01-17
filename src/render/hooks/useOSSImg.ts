/**
 * 使用oss图片缩放
 * https://help.aliyun.com/document_detail/44688.html
 * @param name 图片地址
 */
export default function useOSSImage(imgUrl: string, width?: number, height?: number, mode?: 'lfit' | 'mfit' | 'fill' | 'pad' | 'fixed') {
  if (!imgUrl) {
    return imgUrl;
  }
  if (!mode) {
    mode = 'lfit';
  }
  imgUrl = `${imgUrl}?x-oss-process=image/resize,m_${mode}`;
  if (width) {
    imgUrl += `,w_${width}`;
  }
  if (height) {
    imgUrl += `,h_${height}`;
  }

  return imgUrl;
}
