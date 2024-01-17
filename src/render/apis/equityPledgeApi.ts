import { get, post } from './request';

export class EquityPledgeApi {
  static async getEpTrendCompany(params) {
    return get<any>('data/pledges/trend', params);
  }
  static async getEpRatioCompany(params) {
    return get<any>('data/pledges/scale', params);
  }
  static async getEpDataCompany(params) {
    return get<any>('data/pledges', params);
  }
  static async getEpTrend(params) {
    return post<any>('supervise/pledges/queryStatisticsByZjj', params);
  }
  static async getEpRank(params) {
    return get<any>('data/pledges/rank', params);
  }
  static async getEpRatio(params) {
    return post<any>('supervise/pledges/scale', params);
  }
  static async getEpDataJg(params) {
    return post<any>('supervise/pledges', params);
  }
  static async getEpMap(params) {
    return get<any>('data/pledges/queryStatisticsBydiqu', params);
  }

  static async getEpIndustryRank(params) {
    return get<any>('data/pledges/queryStatisticsByHyqushi', params);
  }
  static async getPledgeRatioPieByZjjId(params) {
    return post<any>('supervise/pledges/getPledgeRatioPieByZjjId', params);
  }
  static async getPledgeTrend(params) {
    return post<any>('supervise/getPledgeTrend', params);
  }
}
