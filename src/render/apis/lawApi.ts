import { get } from './request';

/**
 * 法律法规接口
 */
export class LawApi {
  /**
   * 获取法律法规适用范围
   * @returns
   */
  static async getLawsScope() {
    return get<any>('data/laws/scope');
  }

  /**
   * 获取法律法规发文单位
   * @returns
   */
  static async getLawsIssuer(params) {
    return get<any>('data/laws/issuer', params);
  }

  /**
   * 获取法律法规列表
   * @returns
   */
  static async getLaws(params) {
    return get<any>('data/laws', params);
  }

  /**
   * 获取法律法规详情
   * @returns
   */
  static async getLawsDetail(params) {
    return get<any>('data/laws/detail', params);
  }
}
