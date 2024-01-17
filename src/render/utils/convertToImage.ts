import html2canvas from 'html2canvas-objectfit-fix';
import Canvas2Image from './canvas2Image';

/**
 *
参考 https://daner1990.github.io/plugins/2020/04/23/html2canvas%E6%88%AA%E5%9B%BE%E6%A8%A1%E7%B3%8A/
受到 canvas 画布放缩的启发，我们对特定的 DOM 元素也可以采用类似的优化操作，即设置待优化元素宽高设置为 2 倍或devicePixelRatio倍，然后通过 css 缩放的方式控制其展示大小不变。
例如，对于必须用背景图background的元素，采用以下方式可明显提高快照的清晰度：
.box {
    background: url(/path/to/image) no-repeat;
    width: 100px;
    height: 100px;
    transform: scale(0.5);
    transform-origin: 0 0;
}
其中，width和height为实际显示宽高的 2 倍值，通过transform: scale(0.5)实现了元素大小的缩放，transform-origin根据实际情况设置。} scale
 * @returns
 */
// 创建用于绘制的基础canvas画布
function createBaseCanvas(scale, width, height) {
  const pixelRatio = window.devicePixelRatio;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale * pixelRatio;
  canvas.height = height * scale * pixelRatio;
  // canvas.style.width = width * scale + "px";
  // canvas.style.height = height * scale + "px";

  const context = canvas.getContext('2d');
  context.scale(pixelRatio, pixelRatio);
  return canvas;
}

// 生成快照
export function convertToImage(container: HTMLElement, imgName?: string) {
  // 设置放大倍数
  const scale = 2 / window.devicePixelRatio; //固定死
  // 创建用于绘制的基础canvas画布
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const canvas = createBaseCanvas(scale, width, height);

  // html2canvas配置项
  const ops = {
    scale,
    width,
    height,
    canvas,
    useCORS: true,
    allowTaint: false
  };

  html2canvas(container, ops).then((canvas) => {
    const context: any = canvas.getContext('2d');
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;

    const imageEl = Canvas2Image.convertToPNG(canvas, canvas.width / scale, canvas.height / scale);
    const dataURL = imageEl.getAttribute('src');
    // 下载图片
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = dataURL;
    // 设置下载标题
    a.download = imgName || Date.now().toString();
    a.click();
  });
}

// 生成简单快照
export function convertToBase64Image(container: HTMLElement, quality?: number) {
  return new Promise(function (resolve) {
    // 设置放大倍数
    const scale = 2 / window.devicePixelRatio; //固定死
    // 创建用于绘制的基础canvas画布
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const canvas = createBaseCanvas(scale, width, height);

    // html2canvas配置项
    const ops = {
      scale,
      width,
      height,
      canvas,
      useCORS: true,
      allowTaint: false
    };

    html2canvas(container, ops).then((canvas) => {
      const context: any = canvas.getContext('2d');
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;
      // resolve(canvas.toDataURL('image/jpeg', quality || 1.0));
      setTimeout(() => {
        // 刘萍电脑白边-猜测后修改
        const imgSrc = canvas.toDataURL('image/png');
        resolve(imgSrc);
      }, 20);
    });
  });
}

export function base64toFile(base, filename) {
  const arr = base.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  //转换成file对象
  return new File([u8arr], filename, { type: mime });
}
