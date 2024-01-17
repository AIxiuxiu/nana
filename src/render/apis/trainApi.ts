import { get } from './request';

/**
 * 监管动态接口
 */
export class TrainApi {
  /**
   * 根据公司CODE获取地区信息
   */
  static async getAreaType(params) {
    return get<any>('data/kb/getLocationByCode', params);
  }

  static async getRoadshowList(params) {
    return get<any>('roadshow/getRoadshowList', params);
  }
  /**
   * 产业链加密请求
   * @param params
   * @returns
   */
  static async getSecretKey(params) {
    return get<any>('roadshow/jiami', params);
  }

  /**
   * 诚信库处罚机构
   * @param params
   * @returns
   */
  static async queryPunishOrgs(params) {
    return get<any>('data/queryPunishOrgs', params);
  }

  /**
   * 诚信库诚信类型
   * @param params
   * @returns
   */
  static async queryIntegrityType(params) {
    return get<any>('data/queryIntegrityType', params);
  }
  /**
   * 诚信库列表
   * @param params
   * @returns
   */
  static async getchengxinList(params) {
    return get<any>('data/getchengxinList', params);
  }

  static async getRoadshowInfo(params) {
    return get<any>('roadshow/getRoadshowByPid', params);
  }

  /**
   * 报名加密请求
   * @param params
   * @returns
   */
  static async getBaomingUrl(params) {
    return get<any>('baoming/getUrl', params);
  }
}
