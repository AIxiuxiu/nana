import { get, post } from './request';

export class HomeApi {
  /**
   * 获取辖区公司
   * @returns
   */
  static getOidsByZjjId(params: { zjjid?: string; platformId?: string }) {
    return get<any>('supervise/getOidsByZjjId', params);
  }

  /**
   * 获取广告
   * type 菜单栏广告编号：23 首页顶栏广告编号：24
   * limit
   * @returns
   */
  static getAdsense(type: number, limit: number) {
    return get<any>('roadshow/adsense', { type, limit });
  }

  /**
   * 新版获取广告
   * @returns
   */
  static getIRAdvertList(params) {
    return get<any>('roadshow/getIRAdvertList', params);
  }

  /**
   * 获取热点新闻
   * code
   * page
   * pagesize
   * @returns
   */
  static getHots(params) {
    return get<any>('data/news/hots', params);
  }

  /**
   * 获取热词统计
   * @returns
   */
  static getHotWordCount(params) {
    return get<any>('data/getHotWordCount', params);
  }

  /**
   * 获取某公司前十
   * code
   * @returns
   */
  static getZjjtopCount(params) {
    return post<any>('supervise/getZjjtopCount', params);
  }

  /**
   * 舆情指标排行
   * 类型（1，媒体关注度；2，网民关注度，4，预警度）
   * @returns
   */
  static queryOpinionOrder(params) {
    return post<any>('supervise/queryOpinionOrder', params);
  }

  /**
   * 债券排行
   * @returns
   */
  static postCompanyBondInfo(params) {
    return post<any>('supervise/postCompanyBondInfo', params);
  }

  /**
   * 公司发布公告排名
   * @returns
   */
  static getMostAnnounces(codes) {
    return post<any>('supervise/getMostAnnounces', { codes });
  }

  /**
   * 查询热词列表
   * specialText
   * page
   * pagesize
   * @returns
   */
  static getSpecialQueryInfo(params) {
    return get<any>('data/getSpecialQueryInfo', params);
  }
  /**
   * 获取互动问答
   * @returns
   */
  static getSuperviseNewReply(params) {
    return get<any>('supervise/getSuperviseNewReply', params);
  }

  /**
   * 获取提问
   * @returns
   */
  static getSuperviseNewQuestion(params) {
    return get<any>('supervise/getSuperviseNewQuestion', params);
  }

  /**
   * 首页上市公司列表
   * @returns
   */
  static getSuperviseCompanyList(params) {
    return get<any>('supervise/getSuperviseCompanyList', params);
  }

  /**
   * 首页集体接待日
   * @returns
   */
  static getHomeCollectiveInfo() {
    return get<any>('supervise/getHomeCollectiveInfo');
  }

  /**
   * 首页统计
   * platformId
   * @returns
   */
  static getSuperviseIndexCount(platformId: string) {
    return get<any>('supervise/getSuperviseIndexCount', { platformId });
  }

  static platformcourses(platformId: string) {
    return get<any>('baoming/platformcourses', { platformId });
  }
}
