import { get } from './request';

/**
 * 文件管理接口
 */
export class FileApi {
  /**
   * 上传文件
   * @returns
   */
  static filePath(params: { fileType: string; fileSize: number; realName: string; contentType: string }) {
    return get<any>('roadshow/activity/filePath', params);
  }
}
