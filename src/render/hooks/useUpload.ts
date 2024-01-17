import { FileApi } from '@/apis/fileApi';
import { upload } from '@/apis/request';

type QjOssSign = {
  OSSAccessKeyId: string;
  access_id: string;
  policy: string;
  signature: string;
  key: string;
  callback: string;
  host: string;
  file_path: string;
  callback_var: { [key: string]: string };
};

export enum QjFileType {
  public = '0', //公共目录
  userPicture = '1', //用户头像
  userCard = '2', //用户名片
  companyLogo = '3', //公司LOGO
  companyLicense = '4', //公司资质认证
  companyPicture = '5', //公司图片
  companyProduct = '6', //公司产品
  roadshowCover = '7', //路演封面
  companyPrograma = '8', //路演厅背景
  roadshowGuest = '9', //路演嘉宾头像
  report = '10' //财报
}

/**
 * 上传文件
 * @param fileType
 * @param file
 * @param callback
 * @returns
 */
export const useUpload = (fileType: QjFileType, file: File, progressCallback = new Function()): Promise<{ id: string; url: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('文件不能为空！');
      return;
    }

    const formData = new FormData();
    formData.append('fileType', fileType);
    formData.append('file', file);

    const config = {
      // transformRequest: [
      //   function (data) {
      //     return data;
      //   }
      // ],
      onUploadProgress: function (progressEvent) {
        if (progressEvent.lengthComputable) {
          const percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          progressCallback({ percent: percent });
        }
      }
    };

    upload<any>('upload', formData, config)
      .then((res) => {
        if (res.code == 0) {
          resolve({ id: res.data.ossId, url: res.data.ossUrl.cdnUrl });
        } else {
          reject('上传文件失败' + res.msg);
        }
      })
      .catch((err) => {
        console.error('上传文件失败！' + err);
        reject('上传文件失败！');
      });
  });
};
/**
 * 上传文件
 * @param fileType
 * @param file
 * @param callback
 * @returns
 */
export const useUploadbak = (fileType: QjFileType, file: File, progressCallback = new Function()): Promise<{ id: string; url: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('文件不能为空！');
      return;
    }
    const realName = encodeURIComponent(file.name);
    const fileSize = file.size;
    if (!realName) {
      reject('文件名不能为空！');
      return;
    }
    if (!fileSize) {
      reject('fileSize不能为空！');
      return;
    }

    FileApi.filePath({ fileType, fileSize, realName, contentType: file.type })
      .then((data) => {
        if (data.code == 0) {
          if (data.data && data.data.sign) {
            const sign = data.data.sign;
            if (!sign.file_path) {
              reject('未获取到随机文件名！');
            } else {
              uploadSssFile(file, sign, progressCallback)
                .then((data) => {
                  resolve(data);
                })
                .catch((err) => {
                  reject(err);
                });
            }
          } else {
            reject('请求签名失败！原因：' + data.sign.message);
          }
        } else {
          reject('获取文件上传路径失败！');
        }
      })
      .catch((err) => {
        console.error('获取文件上传路径失败！' + err);
        reject('获取文件上传路径失败！');
      });
  });
};

const uploadSssFile = (file: File, sign: QjOssSign, progressCallback = new Function()): Promise<{ id: string; url: string; path: string }> => {
  return new Promise((resolve, reject) => {
    if (!sign) {
      reject('获取上传配置失败！');
      return;
    }
    if (!sign.callback_var) {
      reject('上传回调的参数为空！');
      return;
    }
    const formData = new FormData();
    formData.append('OSSAccessKeyId', sign.access_id);
    formData.append('policy', sign.policy);
    formData.append('signature', sign.signature);
    formData.append('key', sign.file_path);
    formData.append('callback', sign.callback);
    const obj = sign.callback_var;
    Object.keys(obj).forEach(function (key) {
      formData.append(key, obj[key]);
    });
    formData.append('file', file);

    const config = {
      baseURL: '',
      transformRequest: [
        function (data) {
          return data;
        }
      ],
      onUploadProgress: function (progressEvent) {
        if (progressEvent.lengthComputable) {
          const percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          progressCallback({ percent: percent });
        }
      }
    };

    upload(sign.host, formData, config)
      .then((data) => {
        if (data.code == 0) {
          resolve({ id: data.id, url: data.url, path: data.path });
        } else {
          reject('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败!');
        }
      })
      .catch((err) => {
        console.error('上传文件失败！' + err);
        reject('上传文件失败！');
      });
  });
};

export const useIsImg = (file: File) => {
  return file.type === 'image/jpeg' || 'image/jpg' || 'image/gif' || 'image/png';
};

/**
 * 图片大小判断
 * @param file 图片
 * @param size 大小
 * @returns
 */
export const useImgSize = (file: File, size: { width: number; height: number }, limitImgSize: boolean): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const imgSize = { width: img.width, height: img.height };
      let status = true;
      if (limitImgSize) {
        status = img.width === size.width && img.height === size.height;
      }
      status ? resolve(imgSize) : reject(imgSize);
    };
    img.src = window.URL.createObjectURL(file);
  });
};
