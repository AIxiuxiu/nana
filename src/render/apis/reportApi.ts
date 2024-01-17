import { get } from './request';

/**
 * 报告接口
 */
export class ReportApi {
  /**
   * 获取报告列表
   * @returns
   */
  static async getReports(params) {
    return get<any>('data/report/list', params);
  }
}
