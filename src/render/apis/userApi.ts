import { get, post } from './request';

/**
 * 用户管理接口
 */
export class UserApi {
  /**
   * 获取用户列表
   */
  static getUserList(params) {
    return get<any>('supervise/superviseUserList', params);
  }

  /**
   * 添加用户
   */
  static addCompnayUser(params) {
    return post<any>('supervise/superviseUserAdd', params);
  }

  /**
   * 删除用户
   * @param params
   */
  static deleteCompanyUser(pids) {
    return post<any>('supervise/superviseUserdel', { pids });
  }

  /**
   * 获取用户能操作的菜单
   */
  static getMenuList() {
    return get<any>('supervise/menuList');
  }
  /**
   * 获取用户菜单信息
   */
  static getUserMenuList(userId: string) {
    return get<any>('supervise/getMenuAuth', { userId });
  }

  /**
   * 修改用户权限
   */
  static updateUserAuth(params: { menuIds: string; userId: string; companyId: string }) {
    return post<any>('supervise/saveMenuAuth', { ...params, type: 1 });
  }

  /**
   * 版本更新
   */
  static versionPublish(params: { page: number; pagesize: number; platformType: number }) {
    return get<any>('roadshow/versionpublish', { ...params, applicationType: 1 });
  }

  /**
   * 发送手机验证码
   * @param params 短信类型（登录：LOGIN；修改手机号码：MODIFY_MOBILE）
   */
  static sendSmsCode(params: { mobile: string; tempKey: 'IR_LOGIN' | 'IR_RESET_MOBILE'; mobileArea?: string }) {
    params.mobileArea = '0086';
    return post<any>('roadshow/sendsmscode', params);
  }

  static sendSmsCodeAI(params: { csessionid: string; sig: string; nc_token: string; scene: string; mobile: string; tempKey: 'IR_LOGIN' | 'IR_RESET_MOBILE'; mobileArea?: string }) {
    params.mobileArea = '0086';
    return post<any>('roadshow/sendsmscodeAl', params);
  }

  /**
   * 登录接口
   */
  static login(params: { mobile: string; captcha: string; code?: string }) {
    return get<any>('supervise/login', params);
  }

  /**
   * 修改手机号
   */
  static updateMobile(params: { mobile: string; code: string; mobileArea?: string }) {
    params.mobileArea = '0086';
    return post<any>('roadshow/updatemobile', { ...params, type: 2 });
  }

  /**
   * 反馈
   */
  static saveUserFeedback(params) {
    return post<any>('roadshow/saveuserfeedback', { ...params, applicationType: 1 });
  }

  /**
   * 切换账号
   */
  static switchAccount(params) {
    return get<any>('roadshow/switchCode', params);
  }
  /**
   * 请求专员
   */
  static getCustomerServiceManager() {
    return get<any>('roadshow/company/getcustomerservicemanager');
  }

  // 获取公司信息
  static async getCompanyInfo() {
    return get<IQjCompanyInfo>('roadshow/company/getcompanyinfo');
  }

  // 获取长连接token
  static async getWebToken() {
    return get<any>('middle/getWebToken');
  }

  // 获取股东开发工具用户信息
  static async gdfxUser(code: string) {
    return get<any>('middle/gdfxUser', { code });
  }

  //获取培训ptoken
  static getPeixunUrl(mobile: string, superviseId: string) {
    return get<any>('supervise/getPeixunUrl', { mobile, superviseId });
  }

  /**
   *微信授权
   */
  static wechatLogin(code: string) {
    // 类型：8、董办云 9、机构通 10、安娜
    return get<any>('roadshow/wechatLogin', { code, thirdType: 10 });
  }

  /**
   * 绑定微信用户
   */
  static loginBindWx(weixintoken: string) {
    return get<any>('roadshow/loginBindWx', { weixintoken, thirdType: 10 });
  }

  /**
   *检查是否绑定
   */
  static checkThirdBand() {
    return get<any>('roadshow/checkThirdBand', { thirdType: 10 });
  }

  /**
   *页面里面的绑定
   */
  static havaBindingUserWx(code) {
    // 类型：8、董办云 9、机构通 10、安娜
    return get<any>('roadshow/havaBindingUserWx', { code, thirdType: 10 });
  }

  /**
   *解除绑定
   */
  static cancelThirdBand() {
    // 类型：8、董办云 9、机构通 10、安娜
    return get<any>('roadshow/cancelThirdBand', { thirdType: 10 });
  }
}

export interface IQjCompanyInfo {
  companyLogoOssId: string;
  companyProfileAll: string;
  linkmanDuty: string;
  isOnInfoBar: number;
  companyUrl: string;
  companyLogoOssIdUrl: string;
  lastlogintime: string;
  linkmanMobile: string;
  companyVideoTransUrl: string;
  companyVideoCoverUrl: string;
  isOnTeamBar: number;
  companySite: string;
  ownedAreaName: string;
  linkmanPid: string;
  companyVideoDesc: string;
  companyProfile: string;
  companyCode: string;
  isOnRelated: number;
  companyType: string;
  isOnDynamicBar: number;
  companyFullname: string;
  isOnTitleBar: number;
  linkmanName: string;
  ownedIndustryName: string;
  roadshowHallAuditStatus: number;
  showCompanyCode: boolean;
  profileOssId: string;
  companyId: string;
  isOnOpinionBar: number;
  profileOssIdUrl: string;
  isOnCompanyDynamicBar: number;
  compayTypeName: string;
  luNums: number;
  companyProfileImageFid?: any;
  isOnHotBar: number;
  linkmanMobileArea: string;
  isOnNewBar: number;
  isOnHotOtherBar: number;
  companyShortname: string;
}
