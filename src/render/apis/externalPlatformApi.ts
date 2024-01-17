import { useUserInfo } from '@/hooks/useUserInfo';
import { get, post } from './requestnana';
const { userInfo } = useUserInfo();
export class ExternalPlatformApi {
  /**
   * 创建/修改资讯
   * @returns
   */
  static editList(params) {
    return post<any>(`${userInfo.platform}/api/courses/information`, params);
  }
  /**
   * 资讯列表
   * @returns
   */
  static getList(params) {
    return get<any>(`${userInfo.platform}/api/courses/informationlist`, params);
  }

  /**
   * 删除资讯
   * @returns
   */
  static delList(params) {
    return post<any>(`${userInfo.platform}/api/courses/deleteinformationbyid`, params);
  }
  /**
   * 资讯详情
   * @returns
   */
  static getInformation(params) {
    return get<any>(`${userInfo.platform}/api/courses/information`, params);
  }
  /**
   * 广告列表
   * @returns
   */
  static getFlaglist(params) {
    return get<any>(`${userInfo.platform}/api/courses/flag/list`, params);
  }
  /**
   * 广告添加
   * @returns
   */
  static flagAdd(params) {
    return post<any>(`${userInfo.platform}/api/courses/flag/details/0`, params);
  }
  /**
   * 广告删除
   * @returns
   */
  static flagRemove(params) {
    return post<any>(`${userInfo.platform}/api/courses/flag/remove/${params.id}`);
  }
  /**
   * 获取协会基本信息
   * @returns
   */
  static getPlatformInfo() {
    return get<any>(`${userInfo.platform}/api/association/getPlatformInfo`);
  }
  /**
   * 更新协会基本信息
   * @returns
   */
  static updatePlatformInfo(params) {
    return post<any>(`${userInfo.platform}/api/association/updatePlatformInfo`, params);
  }
}
