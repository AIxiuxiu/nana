/*
 * @Description: 问询函件接口
 * @Author: zxx
 * @Date: 2021-10-12 18:52:19
 */

import { get, post } from './request';

export class EnquiryLetterApi {
  /**
   * 获取函件类型
   */
  static async getEnquiryTypes() {
    return get<any>('data/jiaoyisuo/getAllTypes');
  }

  /**
   * 获取函件列表数据
   */
  static async getEnquiryLetterList(params) {
    return post<any>('data/jiaoyisuo/searchJgcs', params);
  }
}
