import { UserApi } from '@/apis/userApi';
import { storage } from '@/utils/storage';
import dayjs from 'dayjs';
import { inject, InjectionKey, provide, reactive, ref } from 'vue';
/**
 * 用户信息
 */
export interface QjUserInfo {
  pid: string; // 用户Id
  mobileArea: string;
  mobile: string;
  name: string;
  type: number; //1:主账号 2:子账号 3:保姆账号
  superviseId: string; //辖区ID
  supervisorArea: string; //辖区名称
  companyCode: string;
  companyShortname: string;
  companyId: string;
  getCompanyLogoUrl: string;
  zjjid: string; //辖区oid
  codes: string; //辖区所有公司code
  oids: string; //辖区所有公司oid
  platform: string;
  updateTime: any;
  expiryTime: string; // 过期时间
}

// 0显示 1已显示，重新登录再显示 2：不显示
export const SHOW_BING_WX = 'SHOW_BING_WX';

/**
 * 用户信息
 */
export const InjectUserInfoKey: InjectionKey<UserInfoState> = Symbol('UserInfo');

export function provideUserInfo() {
  const state = userInfoState();
  provide(InjectUserInfoKey, state);
  return state;
}

/**
 * 用户信息
 */
export function useUserInfo() {
  const userInject = inject(InjectUserInfoKey);
  if (userInject) {
    return userInject;
  } else {
    return userInfoState();
  }
}

/**
 * 用户状态管理
 */
function userInfoState() {
  const userInfo = reactive<QjUserInfo>(
    storage.get<QjUserInfo>('userInfo') || {
      platform: '',
      companyCode: '',
      companyId: '',
      companyShortname: '',
      mobile: '',
      mobileArea: '',
      name: '',
      pid: '',
      superviseId: '',
      supervisorArea: '',
      type: 2,
      zjjid: '',
      codes: '',
      oids: '',
      updateTime: '',
      expiryTime: '',
      getCompanyLogoUrl: ''
    }
  );
  // 默认不过期
  userInfo.expiryTime = dayjs().add(100, 'day').format('YYYY-MM-DD');
  const tokenState = useTokenState();
  const authState = useUserAuthState();
  const serviceManagerState = useServiceManagerState();

  /**
   * 设置用户信息
   * @param token token
   * @param user 用户信息
   */
  async function setUserInfo(token: string, ptoken: string, user: QjUserInfo, platform: string) {
    // 先设置token
    tokenState.setToken(token, ptoken);
    user.platform = platform;
    storage.set('platform', platform);
    // 清理用户信息
    Object.keys(userInfo).map((key) => {
      delete userInfo[key];
    });
    // 保存用户信息
    updateUserInfo(user);

    storage.set('auths', []);
    await authState.getAuths();

    await getOtherInfo();

    if (storage.get(SHOW_BING_WX) != 2) {
      storage.set(SHOW_BING_WX, 0);
    }
  }

  function updateUserInfo(user) {
    // 保存用户信息
    Object.assign(userInfo, user);
    // 默认不过期
    userInfo.expiryTime = dayjs().add(100, 'day').format('YYYY-MM-DD');
    storage.set('userInfo', userInfo);
  }

  async function getOtherInfo() {
    // 防止重复请求
    if (!userInfo.updateTime || userInfo.updateTime + 60 * 1000 < Date.now()) {
      userInfo.updateTime = Date.now();
      storage.set('userInfo', userInfo);
      // 客服信息
      // await serviceManagerState.getServiceManager();
    }
  }

  /**
   * 清理用户信息
   * @param user
   */
  function cleanUserInfo() {
    Object.assign(userInfo, {});
    storage.set('userInfo', userInfo);

    storage.remove('auths');
    authState.auths && (authState.auths.value = null);

    storage.remove('serviceManager');
    serviceManagerState.serviceManager.value = null;
  }

  return {
    userInfo,
    setUserInfo,
    updateUserInfo,
    cleanUserInfo,
    getOtherInfo,
    ...tokenState,
    ...authState,
    ...serviceManagerState
  };
}

export type UserInfoState = ReturnType<typeof userInfoState>;

/**
 * token状态管理
 */
function useTokenState() {
  const state = reactive<{ token?: string; ptoken?: string; expireTime?: number }>({});
  state.token = storage.get('token');
  state.ptoken = storage.get('ptoken');
  state.expireTime = storage.get('expireTime');
  /**
   * 设置用户信息
   * @param user
   */
  function setToken(token: string, ptoken: string) {
    // 过期时间7*24小时
    const expireTime = Date.now() / 1000 + 24 * 60 * 60 * 7;
    state.expireTime = expireTime;
    state.token = token;
    state.ptoken = ptoken;
    storage.set('token', state.token);
    storage.set('ptoken', state.ptoken);
    storage.set('expireTime', state.expireTime);
  }

  /**
   * 清理用户信息
   * @param user
   */
  function cleanToken() {
    storage.remove('token');
    storage.remove('ptoken');
    storage.remove('expireTime');
    state.token = null;
    state.ptoken = null;
    state.expireTime = null;
  }

  /**
   * 是否登录中
   */
  function isLogin() {
    if (state.token && state.token.length > 0 && state.expireTime && state.expireTime > new Date().getTime() / 1000 && state.ptoken) {
      return true;
    }
    return false;
  }

  return {
    tokenState: state,
    setToken,
    cleanToken,
    isLogin
  };
}

/**
 * serviceManager状态管理
 */
function useServiceManagerState() {
  // 客服管理员
  const serviceManager = ref<{ managerName: string; managerMobile: string }>(storage.get('serviceManager')); //客服专员
  // 设置客服信息
  async function getServiceManager() {
    const res = await UserApi.getCustomerServiceManager();
    if (res && res.code == 0) {
      serviceManager.value = res.data;
      storage.set('serviceManager', serviceManager.value);
    } else {
      storage.remove('serviceManager');
    }
  }
  return { serviceManager, getServiceManager };
}

/**
 * 用户权限
 */
export function useUserAuthState() {
  const auths = ref<string[]>(storage.get('auths'));
  // 获取权限
  async function getAuths() {
    const userInfo = storage.get<QjUserInfo>('userInfo');
    if (!userInfo) {
      storage.remove('auths');
      return;
    }
    const res = await UserApi.getUserMenuList(userInfo.pid);
    if (res && res.code == 0) {
      auths.value = res.data.map((v) => v.code);
      storage.set('auths', auths.value);
    } else {
      storage.remove('auths');
    }
  }
  return { auths, getAuths };
}
