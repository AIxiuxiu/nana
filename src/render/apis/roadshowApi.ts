import { get, post } from './request';

//封装 路演 接口方法
export class RoadshowApi {
  /**
   * 获取路演
   * @param params
   * @returns
   */
  static async getRoadshowListForZjj(params: { page: number; pagesize: number; platformId: string; type?: string; title?: string; companyCode?: string }) {
    return get<any>('supervise/getRoadshowListForZjj', { start: '2017-04-01', ...params });
  }

  /**
   * 获取路演映射表数据
   * @returns
   */
  static getDic(params) {
    return get<any>('roadshow/activity/getdict', params);
  }

  /**
   * 获取所有的路演类型
   */
  static getRoadshowType() {
    return get<any>('roadshow/getRoadshowType');
  }

  /**
   * 获取路演方式
   */
  static getRoadshowMode() {
    return get<any>('roadshow/getRoadshowMode');
  }

  /**
   * 获取路演列表
   * @returns
   */
  static async getRoadshowList(params) {
    return get<any>('roadshow/getRoadshowList', params);
  }

  /**
   * 获取路演详情
   */
  static async getRoadshowInfo(pid) {
    return get<any>('roadshow/getRoadshowByPid', { pid });
  }

  /**
   * 获取路演列表
   * @param params
   * @returns
   */
  static getRoadshowApplyList(params: {
    page: number;
    pagesize: number;
    title?: string;
    startDate?: string;
    endDate?: string;
    roadshowType?: string;
    roadshowMode?: string;
    companyId?: string;
    ownedIndustry?: string;
  }) {
    return get<any>('roadshow/getRoadshowApplyList', params);
  }

  /**
   * 获取看板路演详情
   * @returns
   */
  static getRoadshowDetail(params: { pid: string; status: number | string }) {
    return get<any>('roadshow/getRoadshowNewByPid', params);
  }

  /**
   * 创建路演
   * @returns
   */
  static addRoadshow(params) {
    return post<any>('roadshow/activity/addOrUpdateRoadshow', params);
  }

  /**
   * 删除路演
   * @returns
   */
  static deleteRoadshow(pid) {
    return post<any>('roadshow/activity/deleteRoadshow', { pid });
  }

  /**
   * 获取公司嘉宾
   * @returns
   */
  static getCompanyTeam() {
    return get<any>('roadshow/getCompanyTeam');
  }

  /**
   * 获取路演嘉宾
   * @returns
   */
  static getGuestInfoByPid(pid) {
    return get<any>('roadshow/getGuestInfoByPid', { pid });
  }

  /**
   * 获取已回复的问题列表
   * @returns
   */
  static getReplyedQuestionListFromRoadshow(params) {
    return get<any>('roadshow/activity/getReplyedQuestionListFromRoadshow', params);
  }

  /**
   * 路演提问列表
   * @params {pid:路演id, sendStatus:问题状态 1：待审核 2：已送出未回复	}
   */
  static getUnReplyQuestionListFromRoadshow(params: { pid: string; sendStatus: 1 | 2; page: number; num: number }) {
    return get<any>('roadshow/activity/getUnReplyQuestionListFromRoadshow', params);
  }

  /**
   * 删除提问
   * @params {guestId:嘉宾id	}
   */
  static delQuestion(params: { guestId: string; str: { pid: string; version: string; delReason: string }[] }) {
    return post<any>('roadshow/activity/delQuestion', params);
  }

  /**
   * 送出提问
   * @params {guestId:嘉宾id	}
   */
  static sendUnReplyRoadshowList(params: { guestId: string; str: { pid: string; version: string }[] }) {
    return post<any>('roadshow/activity/sendUnReplyRoadshowList', params);
  }

  /**
   * 问答回复
   * @param params  {
      "questionId":"1234",
      "questionVsn":1,
      "replyContent":"公司近期一切经营正常。".
      "guestId":"1234",
      "replyPlatform":"4"
    }
   * @returns
   */
  static saveReply(params) {
    params.replyPlatform = '4';
    return post<any>('roadshow/activity/saveReply', params);
  }

  /**
   * 更新问题（回复已经回答过的问题）
   * @param params  {
      "questionId":"1234",
      "questionVsn":1,
      "replyId":"2345",
      "replyVsn":1,
      "replyContent":"公司近期一切经营正常。".
      "guestId":"1234",
      "replyPlatform":"4"
    }
   * @returns
   */
  static updateReply(params) {
    params.replyPlatform = '4';
    return post<any>('roadshow/activity/updateReply', params);
  }

  /**
   * 获取路演公告
   * @param pid
   * @returns
   */
  static getRoadshowNotice(pid) {
    return get<any>('roadshow/activity/getRoadshowNotice', { pid });
  }

  /**
   * 下载公告
   * @param pid
   * @returns
   */
  static downloadRoadshowNotice(pid) {
    return get<any>('roadshow/activity/downloadRoadshowNotice', { pid });
  }

  /**
   * 修改路演公告
   * @param pid
   * @returns
   */
  static updateRoadshowNotice(params: { pid: string; notice: string }) {
    return post<any>('roadshow/activity/updateRoadshowNotice', params);
  }

  /**
   * 更新回答问题的嘉宾
   * @returns
   */
  static updateGuest(params: { pid: string; guestId: string; version: string; userId: string }) {
    return post<any>('roadshow/activity/updateGuest', params);
  }

  /**
   * 路演问题下载地址
   * @returns
   */
  static roadshowQuestionUrl(roadshowId: string) {
    return get<any>('roadshow/question/getQuestionExportUrl', { roadshowId });
  }

  /**
   * 路演互动情况统计
   * @returns
   */
  static getRsQrStatistics(pid: string) {
    return get<any>('roadshow/activity/getRsQrStatistics', { pid });
  }

  /**
   * 查询路演报名情况统计(审核过的用户数量等)
   * @returns
   */
  static getRoadshowPersonCount(pid: string) {
    return get<any>('roadshow/activity/getRoadshowPersonCount', { pid });
  }

  /**
   * 获取报名用户情况（饼图）
   * @returns
   */
  static roadshowPerson(pid: string) {
    return get<any>('roadshow/activity/roadshowPerson', { pid });
  }

  /**
   * 查询路演报名用户列表 {
   pid: 路演ID,
   personType: 人员类型 0：白名单 1：报名
   name
   company
   }
   */
  static roadshowPersonListPage(params) {
    params.personType = '1';
    return get<any>('roadshow/activity/roadshowPersonListPage', params);
  }

  /**
   * 获取报名用户情况（饼图）
   * @returns
   */
  static roadshowPersonType(pid: string) {
    return get<any>('roadshow/activity/roadshowPersonType', { pid });
  }

  /**
   * 新建嘉宾致辞
   * @param params  {
    "pid":"路演的id",
    "content":"致辞内容",
    "userId":"发言人ID",
    "orderNo":"排序号"
    }
   * @returns
   */
  static saveSpeak(params) {
    return post<any>('roadshow/activity/saveSpeak', params);
  }

  /**
   * 查询嘉宾致辞信息
   * @returns
   */
  static getHostList(pid: string) {
    return get<any>('roadshow/activity/getHostList', { pid });
  }

  /**
   * 删除嘉宾致辞
   * @param params {
    "strRoadshowHost":[
        {
            "pid":"0001AD92431749B04A1FAD0EAFF2394F84C4",
            "version":"0",
            "hostStatus":"1"
        },
        {
            "pid":"0001A414E509D89E4C68A92B64810FB8397C",
            "version":"0",
            "hostStatus":"1"
        }
    ],
    "updateUserId":"发言人id"
  }
   * @returns
   */
  static delSpeak(params) {
    return post<any>('roadshow/activity/delSpeak', params);
  }

  /**
   * 获取下载互动信息URL
   * @param pid
   * @returns
   */
  static getQuestionExportUrl(pid) {
    return get<any>('roadshow/activity/getQuestionExportUrl', { pid });
  }

  /**
   * 获取投资者关系记录表下载地址
   * @param pid
   * @returns
   */
  static getActivityRecordUrl(params) {
    return get<any>('middle/getActivityRecordUrl', params);
  }

  /**
   * 获取路演的活动报告下载地址
   * @param pid
   * @returns
   */
  static getActivityReportUrl(params) {
    return get<any>('middle/getActivityReportUrl', params);
  }

  /**
   * 获取活动现场图片
   * @param pid
   * @returns
   */
  static getRoadShowPhotoesByPid(params) {
    return get<any>('roadshow/activity/getRoadShowPhotoesByPid', params);
  }

  /**
   * 看板获取互动问题、图片等数量
   * @param pid
   */
  static getIrRoadshowKanbanCount(pid) {
    return get<any>('roadshow/activity/getIrRoadshowKanbanCount', { pid });
  }

  /**
   * 获取活动资讯列表
   */
  static queryNewsByRoadshowId(params: { pid: string; startDate?: string; endDate?: string; page?: string; pagesize?: string }) {
    return get<any>('data/queryNewsByRoadshowId', params);
  }

  /**
   * 获取路演看板的H5页面URL
   * @param pid
   */
  static getActivityH5(pid) {
    return get<any>('middle/activityH5', { pid });
  }

  /**
   * 获取路演下的附件列表
   * @param pid
   */
  static getRoadshowByFiles(pid) {
    return get<any>('roadshow/activity/getRoadshowByFiles', { pid });
  }

  /**
   * 获取路演专员
   * @param pid
   */
  static getRoadshowOwner(pid) {
    return get<any>('roadshow/getRoadshowOwner', { pid });
  }

  /**
   * 获取集体接待日列表
   * @param params
   * @returns
   */
  static getCollectiveRoadshowList(params: { page: number; pagesize: number; title?: string }) {
    return get<any>('supervise/getCollectiveRoadshowList', params);
  }

  /**
   * 获取报名审核列表
   * @param params
   * @returns
   */
  static getGuestAuditList(params) {
    return get<any>('supervise/getGuestAuditList', params);
  }

  /**
   * 获取路演报名审核统计
   * @param params
   * @returns
   */
  static getGuestAuditStatistics(roadshowId: string) {
    const params = { roadshowId: roadshowId };
    return get<any>('supervise/getGuestAuditStatistics', params);
  }

  /**
   * 审核参会嘉宾
   * @param params
   * @returns
   */
  static batchAuditGuest(params) {
    return post<any>('supervise/batchAuditGuest', params);
  }

  /**
   * 导出参会嘉宾
   * @param params
   * @returns
   */
  static exportGuestAuditList(roadshowId: string) {
    const params = { roadshowId: roadshowId };
    return get<any>('supervise/exportGuestAuditList', params);
  }

  /**
   * 删除参会嘉宾
   * @param params
   * @returns
   */
  static deleteGuest(guestId) {
    return post<any>('supervise/deleteGuest', { guestId: guestId });
  }

  /**
   * 修改参会嘉宾
   * @param params
   * @returns
   */
  static superviseUpdateGuest(params) {
    return post<any>('supervise/updateGuest', params);
  }

  /**
   * 获取集体接待日报告下载地址
   * @param pid
   * @returns
   */
  static qReportInfoById(rid) {
    return get<any>('supervise/report/qReportInfoById', { rid });
  }

  /**
   * 获取集体接待日报名时间
   * @param pid
   * @returns
   */
  static getDetailByRid(rid) {
    return get<any>('baoming/getDetailByRid', { rid });
  }

  /**
   * 获取嘉宾列表
   * @param params
   * @returns
   */
  static getRoadshowGuestPWD(params) {
    return get<any>('supervise/getRoadshowGuestPWD', params);
  }

  /**
   * 获取报名导出url
   * @param params
   * @returns
   */
  static getExportGuestAuditUrl(roadshowId) {
    return get<any>('supervise/getExportGuestAuditUrl', { roadshowId });
  }

  /**
   * 获取嘉宾信息导出url
   * @param params
   * @returns
   */
  static getExportGuestUrl(roadshowId) {
    return get<any>('supervise/getExportGuestUrl', { roadshowId });
  }

  /**
   * 获取嘉宾信息导出url
   * @param params
   * @returns
   */
  static getRsQrStatisticsForJ(pid) {
    return get<any>('roadshow/activity/getRsQrStatisticsForJ', { pid });
  }

  /**
   * 获取集体接待日公司回复列表
   * @param params
   * @returns
   */
  static getRsQrCompanyList(params) {
    return get<any>('roadshow/activity/getRsQrCompanyList', params);
  }
  /**
   * 获取签到报名地址
   * @param params
   * @returns
   */
  static getH5Page(params) {
    return get<any>('supervise/h5Page', params);
  }
  /**
   * 集体接待日问答列表
   * @param params
   * @returns
   */
  static getCollectQAPages(params) {
    return get<any>('supervise/getCollectQAPages', params);
  }

  /**
   * 集体路演报名嘉宾单个审核
   * @param params
   * @returns
   */
  static auditGuestCollective(params) {
    return post<any>('supervise/auditGuestCollective', params);
  }
  /**
   * 集体路演报名嘉宾单个审核
   * @param params
   * @returns
   */
  static getSign(params) {
    return get<any>('baoming/getSign', params);
  }

  /**
   * 报名日统计
   * @param params
   * @returns
   */
  static getGuestAuditDayStat(roadshowId) {
    return get<any>('supervise/getGuestAuditDayStat', { roadshowId });
  }
  /**
   * 集体路演公司
   * @param params
   * @returns
   */
  static getCollectiveCompany(params) {
    return get<any>('roadshow/company/getCollectiveCompany', params);
  }
  /**
   * 签到列表
   * @param params
   * @returns
   */
  static getSignUser(params) {
    return get<any>('baoming/getSignUser', params);
  }
  /**
   * 获取导出链接
   * @param params
   * @returns
   */
  static signUserExport(params) {
    return get<any>('baoming/signUserExport', params);
  }
  /**
   * 现场图片
   * @param params
   * @returns
   */
  static getRoadshowCollectionImg(params) {
    return get<any>('roadshow/getRoadshowCollectionImg', params);
  }
  /**
   * 互动统计导出
   * @param params
   * @returns
   */
  static roadshowquestionurl(params) {
    return get<any>('roadshow/question/roadshowquestionurl', params);
  }
  /**
   * 公司
   * @param params
   * @returns
   */
  static getCompanyInfo(params) {
    return get<any>('supervise/getCompanyInfo', params);
  }

  /**
   * 送出回复(审核回复)
   */
  static sendReply(params) {
    return post<any>('roadshow/activity/sendReply', params);
  }

  /**
   * 获取活动嘉宾
   * @param params
   * @returns
   */
  static getRoadshowGuestPWD1(params: { roadshowId: string; guestName: string }) {
    return get<any>('roadshow/getRoadshowGuestPWD', params);
  }

  /**
   * 修改保存嘉宾
   * @param params
   * @returns
   */
  static saveOrUpdateGuest(params: {
    userId: string;
    roadshowId: string;
    companyId: string;
    guestName: string;
    guestPassword: string;
    position: string;
    mobile: string;
    vipDesc: string;
    headOssId: string;
    pid?: string;
    orderNumber?: number;
  }) {
    return post<any>('roadshow/saveOrUpdateGuest', params);
  }

  /**
   * 删除活动嘉宾
   * @param params
   * @returns
   */
  static removeGuestPids(params: { userId: string; pids: string }) {
    return post<any>('roadshow/removePids', params);
  }

  /**
   * 修改嘉宾排序
   * @param params
   * @returns
   */
  static updateUpDownGuest(params: { userId: string; thisPid: string; thisOrderNumber: string; otherPid: string; otherOrderNumber: string }) {
    return post<any>('roadshow/updateUpDownGuest', params);
  }

  /**
   * 白名单列表
   * @param params
   * @returns
   */
  static getPersonList(params: { companyRoadshowId: string; personType: string; mobile: string; page: string; pagesize: string }) {
    return get<any>('supervise/personList', params);
  }

  /**
   * 添加白名单
   * @param params
   * @returns
   */
  static addPerson(params: { operUserId: string; mobile: string; companyRoadshowId: string; companyBaseinfoId: string; userRealname: string; duty: string; userCompany: string }) {
    return post<any>('supervise/addPerson', params);
  }

  /**
   * 添加白名单
   * @param params  type 0：白名单 1：报名记录
   * @returns
   */
  static deletePerson(params: { companyRoadshowId: string; pids: string; type: string }) {
    return post<any>('supervise/deletePerson', params);
  }

  /**
   * 报名审核
   * @param params
   * @returns
   */
  static saveRoadshowReportList(params) {
    return post<any>('supervise/saveRoadshowReportList', params);
  }

  /*
   * 导出路演参会列表
   * personType 参与类型（0:邀请，1:报名）
   * isChecked 是否审核:邀请（0,未接受，1：接受，2：忽略）；报名（0,未审核，1：已审核，2：审核未通过）
   */
  static exportReportList(params: { companyRoadshowId: string; personType: string; isChecked: string }) {
    return get<any>('supervise/exportReportList', params);
  }
}
