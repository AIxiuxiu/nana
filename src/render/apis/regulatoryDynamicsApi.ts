/*
 信息公示接口
 */

import { get, post } from './request';

export class RegulatoryDynamicsApi {
  /**
   * 获取所有辖区信息
   * @returns
   */
  static async getDomain() {
    return get<any>('supervise/csrc/getDomain');
  }
  /**
   * 查询信息公示信息
   * @returns
   */
  static async searchNotice(params) {
    return post<any>('data/csrc/searchNotice', params);
  }
  /**
   * 根据URL获取文章详情
   * @returns
   */
  static async getDetailInfo(params) {
    return get<any>('data/csrc/getDetailInfo', params);
  }
  /**
   * 根据辖区获取栏目信息
   * @returns
   */
  static async getChannelByDomain(params) {
    return get<any>('data/csrc/getChannelByDomain', params);
  }
}
