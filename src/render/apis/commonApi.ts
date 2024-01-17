import { get } from './request';

export class CommonApi {
  /**
   * 获取所有公司
   * @returns
   */
  static async getAllCompanys(params) {
    return get<any>('roadshow/company/querycompanyinfo', params);
  }

  /**
   * 获取公司信息
   * @returns
   */
  static async getCompanyinfo() {
    return get<any>('roadshow/company/getcompanyinfo', {});
  }

  /**
   * 获取所有公司(查询KB，根据关键词、code查询公司列表)
   * @returns
   */
  static async getAllCompanysFromKB(params) {
    return get<any>('data/jiaoyisuo/getShortNameByKeyword', params);
  }

  /**
   * 获取公司
   * @param params
   * @returns
   */
  static async getZjjCompanys(platformId: string) {
    return get<any>('supervise/createdValidJson', { platformId, page: 1, pagesize: 999 });
  }

  /**
   * 视窗登录
   * @param phone
   * @returns
   */
  static async loginsc(phone: string) {
    return get<any>('supervise/loginsc', { phone });
  }
}
