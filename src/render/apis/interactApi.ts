import { get, post } from './request';

//  互动问答
export class InteractApi {
  /**
   * 获取互动列表
   * @returns
   */
  static async getInteractList(params) {
    return get<any>('roadshow/question/receivequestion', params);
  }

  /**
   * 获取互动统计
   * @returns
   */
  static async getInteractStatistic(params) {
    return get<any>('roadshow/question/statistics', params);
  }

  /**
   * 互动回复
   * @returns
   */
  static async getInteractAnswer(params) {
    return post<any>('roadshow/question/savereplyofqd', params);
  }

  /**
   * 导出互动数据
   * @returns
   */
  static async exportQuestion(params) {
    return get<any>('roadshow/question/exportquestionurl', params);
  }

  /**
   * 辖区内上市公司互动问答列表
   * @returns
   */
  static async getQuestionList(params) {
    return get<any>('supervise/qaQuery', params);
  }
  /**
   * 获取辖区内上市公司列表
   * @returns
   */
  static async getCompanysInLocation(params) {
    return get<any>('supervise/createdValidJson', params);
  }
  /**
   * 获取辖区内监管对象列表
   * @returns
   */
  static async getlinkmanInLocation(params) {
    return get<any>('supervise/querylinkmanBysupervise', params);
  }
  /**
   * 数据统计-图表
   * @returns
   */
  static async getAreaCQCount(params) {
    return get<any>('supervise/getAreaCQCount', params);
  }

  /**
   * 数据统计-图表-未回复问题
   * @returns
   */

  static async getAreaNQCount(params) {
    return get<any>('supervise/getAreaNQCount', params);
  }

  /**
   * 数据统计-问题列表
   * @returns
   */
  static async getAreaQCountTotal(params) {
    return get<any>('supervise/getAreaQCountTotal', params);
  }

  /**
   * 数据统计-问题列表
   * @returns
   */
  static async querylinkmanBysuperviseExcel(params) {
    return get<any>('supervise/querylinkmanBysuperviseExcel', params);
  }

  static async getAreaQCountTotalExcel(params) {
    return get<any>('supervise/getAreaQCountTotalExcel', params);
  }

  static async getAreaCQCountExcel(params) {
    return get<any>('supervise/getAreaCQCountExcel', params);
  }

  static async getAreaNQCountExcel(params) {
    return get<any>('supervise/getAreaNQCountExcel', params);
  }
}
