import { get } from './request';

//封装 视频 接口方法
export class VideoApi {
  /**
   * 获取路演
   * @param params
   * @returns
   */
  static async getVideoListBySearch(params: { page: number; pagesize: number; keyword?: string; startTime: string; endTime: string; title?: string }) {
    return get<any>('roadshow/getVideoListBySearch', params);
  }
}
