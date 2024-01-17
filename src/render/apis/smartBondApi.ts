/*
 智能债券接口
 */

import { get, post } from './request';

//封装User类型的接口方法
export class SmartBondApi {
  /**
   * 获取债券信息列表-公司
   * @returns
   */
  static async getSmBondListCompany(params) {
    return get<any>('data/sb/bs', params);
  }
  /**
   * 获取同行业债券发布量排行-公司
   * @returns
   */
  static async getSmBondPublishCompany(params) {
    return get<any>('data/sb/bc', params);
  }
  /**
   * 获取债券信息列表-机构
   * @returns
   */
  static async getSmBondList(params) {
    return post<any>('supervise/sb/bszjj', params);
  }
  /**
   * 获取同行业债券发布量排行-机构
   * @returns
   */
  static async getSmBondPublish(params) {
    return post<any>('supervise/sb/bczjj', params);
  }
  /**
   * 搜索公司接口
   * @returns
   */
  static async getCompanyInfo(params) {
    return get<any>('roadshow/company/querycompanyinfo', params);
  }
  /**
   * 债券详情
   * @returns
   */
  static async getBondDetail(params) {
    return get<any>('data/sb/detail', params);
  }
  /**
   * 周敏感
   * @returns
   */
  static async getNewsList(params) {
    return get<any>('data/news/getnewslist', params);
  }
}
