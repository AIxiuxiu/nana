import { get, post } from './request';

export class OpinionWarningApi {
  /**
   * 新闻统计
   * @param params
   * @returns
   */
  static async getStatistics(params) {
    return post<any>('supervise/statistics/sensitive', params);
  }

  /**
   * 新闻列表
   * @param params
   * @returns
   */
  static async getNewsList(params) {
    return post<any>('supervise/news/getnewslist', params);
  }

  /**
   * 媒体占比
   * @param params
   * @returns
   */
  static async getMediaRatio(params) {
    return post<any>('supervise/media/rate', params);
  }

  /**
   * 媒体活跃度
   * @param params
   * @returns
   */
  static async getMediaRank(params) {
    return post<any>('supervise/media/rank', params);
  }

  /**
   * 媒体走势图
   * @param params
   * @returns
   */
  static async getMediaTrend(params) {
    return post<any>('supervise/media/trend', params);
  }

  static async getNewsDetail(params) {
    return get<any>('data/news/detail', params);
  }

  static async getNewsSimilar(params) {
    return get<any>('data/news/similar', params);
  }
}
