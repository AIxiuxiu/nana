/**
 * 实体类型说明
 */

import { Component, Ref } from 'vue';

interface IQjInjectTable {
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalCount: Ref<number>;
  onCurrentChange: (val: number) => void;
  onSizeChange: (val: number) => void;
  refresh: (params?: any) => void;
}

interface IQjMenuTab {
  path: string;
  component?: any;
  meta?: {
    title: string;
    authCode: number;
  };
  children?: {
    path: string;
    component?: any;
    meta?: {
      title: string;
      authCode: number;
    };
  }[];
}

type IQjDetailParams = { [key: string]: string | number | boolean };

type IQjDetailComponent = {
  /**
   * component or html
   */
  component: string | Component;
  /**
   * 详情组件参数 props 只支持基本类型
   */
  params?: IQjDetailParams;
  /**
   * 详情路由
   */
  route: { name?: string; path?: string };
  id?: string;
  title?: string;
  style?: {};
};

type IQjModalEvent = 'before-open' | 'opened' | 'before-close' | 'closed' | 'drag:start' | 'drag:move' | 'drag:end' | 'resize:start' | 'resize:move' | 'resize:end';

type IQjModalData = {
  /**
   * QjModal v-modal
   */
  value: boolean;
  /**
   * bind props and attrs to QjModal
   */
  bind?: { [key: string]: any };
  /**
   * register events to QjModal
   */
  on?: { [key in IQjModalEvent]?: Function };
};

interface IQjDetailModals extends IQjModalData {
  id: string;
  detail: IQjDetailComponent;
}

interface IQjInjectQjModals {
  modals: any[];
  openedModals: any[];
  detailModals: { [key: string]: IQjDetailModals };
}

// 路演缓存数据，
interface IQjRoadshowCache {
  // 路演方式
  modesLoading: Ref<boolean>;
  roadshowModes: Ref<{ dictContCode: string; dictContName: string }[]>;
  // 路演类型
  typesLoading: Ref<boolean>;
  roadshowTypes: Ref<{ dictContCode: string; dictContName: string }[]>;
  // 路演方式
  yjModesLoading?: Ref<boolean>;
  jyRoadshowModes?: Ref<{ dictContCode: string; dictContName: string }[]>;
  // 路演模板
  templateLoading?: Ref<boolean>;
  roadshowTemplates?: Ref<{ [key: string]: { dataName: string; dataCode: number; dataPCode: number; dataRemark: string }[] }>;
  // 封面
  coverTemplatesLoading?: Ref<boolean>;
  roadshowCoverTemplates?: Ref<{ dictContCode: string; dictContName: string; dictContDesc: string }[]>;
}

interface QjGuest {
  guestPassword: string;
  mobile: string;
  position: string;
  guestId: string;
  guestName: string;
}

// 路演信息
interface QjRoadshow {
  isInterflowShow: number;
  distinction: number;
  creUser: string;
  pid: string;
  remark?: any;
  checkedTime?: any;
  roadshowType: string;
  roadshowCoverOssIdUrl: string;
  roadshowDateFinish: string;
  guestsList?: any[];
  beginTime: string;
  activityIntroduceAll: string;
  roadshowTitle: string;
  linkmansList: any[];
  updateDttm: number;
  updateUser?: any;
  companyBaseinfoId: string;
  roadshowDate: string;
  conferencesList?: any[];
  roadshowStatus: string;
  roadshowCoverOssId: string;
  endTime: string;
  roadshowStatusName: string;
  checkedPerson?: any;
  activityIntroduce: string;
  creDttm: number;
  roadshowMode: string;
  isReplyShowInfo: string; //回复后是否直接显示  1：直接显示 0：审核后显示
  isGuestAuditQuestion: string; //嘉宾审核问题权限  1：有权限  0：无权限
  serviceType: string;
}

// 路演嘉宾
interface IQjRoadshowInfo {
  roadshowId: string;
  // 加载路演信息中
  loadingRoadshow: Ref<boolean>;
  // 路演信息
  roadshow: Ref<QjRoadshow>;
  // 嘉宾列表
  guests: Ref<QjGuest[]>;
  // 选中嘉宾
  currentGuest: Ref<QjGuest>;
}

interface IQjOpinionWarning {
  otherParams: Ref<any>;
  refresh: () => void;
  onRefresh: (fun: (value: any) => void) => void;
}

interface IQjEquityPledge {
  companyInfo: Ref<any>;
  refresh: () => void;
  onRefresh: (fun: (companyInfo?: any) => void) => void;
}

// 埋点
type IQjTrackInfo = Indexable<string | number>;

interface IQjAuthMenus {
  name: string;
  pid: string;
  parentId: string;
  level: number;
  isDefault: number;
  isShow: number;
  child?: IQjAuthMenu[];
}

interface IQjAuthMenu {
  name: string;
  pid: string;
  parentId: string;
  level: number;
  isDefault: number;
  isShow: number;
}

interface IQjAuth {
  menus: Ref<IQjAuthMenus[]>;
  defaultMenuCheck: Ref<string[]>;
}
interface IQjSensitiveData {
  sensitiveData: Ref<{ [key: string]: any }>;
  refresh: () => void;
  onRefresh: (fun: (value: { sensitiveData?: {} }) => void) => void;
}

export interface QJDownloadItem {
  getReceivedBytes: number;
  totalBytes: number;
  startTime: number;
  name: string;
  url: string;
  isPaused: boolean;
  canResume: boolean;
  savePath: string | null;
  dataState: string;
  totalSize?: string;
  state?: string;
  icon?: string;
}

//会议信息
interface IQjCmMeetingInfo {
  pid: string;
  // 加载中
  loadingMeeting: Ref<boolean>;
  // 会议信息
  meeting: Ref<QjCmMeeting>;
}

interface QjCmMeeting {
  id: string;
  mid: string;
  name: string;
  status: number; // 会议状态：0：未开始 1：进行中 2：已结束
  type: string; //会议类型: 1线下，2线上，3线下+线上，4快速
  meetingDate: string;
  startTime: string;
  endTime: string;
  content: string;
  userMobile: string;
  platformCode: string;
  isRequired: number;
  requiredEndTime: string;
  address: string;
  yicheng: any[];
  applyNumSwitch: number;
  applyNum: number;
  coverOssid: string;
  coverUrl: string;
  applyFields: string;
  contact1: { name: string; mobile: string; company: string; duty: string; index?: number; type: number }[]; // 联系人
  contact2: { name: string; mobile: string; company: string; duty: string; index?: number; type: number }[]; //会议嘉宾
  contact3: { name: string; mobile: string; company: string; duty: string; index?: number; type: number }[]; //主持人
}
