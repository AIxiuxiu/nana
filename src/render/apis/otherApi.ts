/*
 * @Description: 示例接口
 * @Author: ahl
 * @Date: 2021-09-30 13:38:19
 * @LastEditTime: 2023-03-15 13:12:03
 */

import { get, post } from './request';

//封装其他类型的接口方法
export class OtherApi {
  /**
   * 添加记录
   * @returns
   */
  static insertEventRecord(params) {
    return post<any>('log/insertEventRecordList', params);
  }
  /**
   * 添加记录
   * @returns
   */
  static addGETRecord(path, params) {
    return get<any>(`log/nana/${path}`, { params });
  }
  /**
   * 添加记录
   * @returns
   */
  static addPOSTRecord(path, params) {
    return post<any>(`log/nana/${path}`, params);
  }
}
