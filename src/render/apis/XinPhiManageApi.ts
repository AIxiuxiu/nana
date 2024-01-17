/*
 * @Description: 问询函件接口
 * @Author: zxx
 * @Date: 2021-10-13 09:34:19
 */

import { get } from './request';

export class XinPhiManageApi {
  /**
   * 所有板块
   */
  static async getAllSectorOptions() {
    return get<any>('data/plates');
  }

  /**
   * 所有省份
   */
  static async getAllProvinceOptions() {
    return get<any>('data/provinces');
  }

  /**
   * 省份下城市
   */
  static async getProvinceCitiesOptions(params) {
    return get<any>('data/cities', params);
  }

  /**
   * 所有行业
   */
  static async getIndustryOptions() {
    return get<any>('data/trades');
  }

  /**
   * 公告类型
   */
  static async getAnnouncementTyps() {
    return get<any>('data/announces/type');
  }

  /**
   * 搜索
   */
  static async search(params) {
    return get<any>('data/announces/search', params);
  }

  /**
   * 获取详情
   */
  static async getAnnouncementDetail(id) {
    return get<any>('data/announces/detail', id);
  }
}
