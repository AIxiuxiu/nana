import { get, post } from './request';

export class ConferenceManagementApi {
  static getRoadshowCoverTemplates() {
    return get<any>('roadshow/getLydt');
  }

  /**
   * 获取会议列表
   * @returns
   */
  static getMeetingList(params) {
    return post<any>('supervise/meeting/meetingList', params);
  }

  /**
   * 删除会议
   * @returns
   */
  static meetingDel(id) {
    return get<any>('supervise/meeting/delmeeting', { id });
  }

  /**
   * 申请会议
   * @returns
   */
  static addMeeting(params) {
    return post<any>('supervise/meeting/apply', params);
  }

  /**
   * 更新会议
   * @returns
   */
  static updateMeeting(params) {
    return post<any>('supervise/meeting/update', params);
  }

  /**
   * 获取会议详情
   * @returns
   */
  static getMeetingDetail(id) {
    return get<any>('supervise/meeting/meetingDetail', { id });
  }

  /**
   * 会议关联的报名问卷列表
   */
  static async meetingEnrollSheets(meetingId) {
    return get<any>('sanhui/orgMeetingEnrollSheets', { meetingId });
  }

  /**
   * 云会议-更新会议
   * @param params
   * @returns
   */
  static mettingUpdate(params) {
    return post<any>('middle/mettingUpdate', params);
  }

  /**
   * 云会议-会议详情
   * @param params
   * @returns
   */
  static async getMettingDetail(params) {
    return get<any>('middle/mettingDetail', params);
  }

  /**
   * 一键发送短信(选择用户)
   * @param params
   * @returns
   */
  static sendSmsByPhones(params) {
    return post<any>('middle/sendSmsByPhones', params);
  }

  /**
 * 手动审核
 * params: 1	id
  2	status	审核结果，1通过、2不通过	是	[string]
  * @returns
  */
  static meetingUserAudit(params) {
    return post<any>('supervise/meeting/userAudit', params);
  }

  /**
   * 获取审核类型
   * @returns
   */
  static getMeetingPersonCheckTypes() {
    return get<any>('middle/selectByDisctCode', { dictCode: 'GD_AUDIT_STATE' });
  }

  //会议文件
  /**
   * 会议文件列表
   * @param params
   * @returns
   */
  static meetingFileList(params) {
    return post<any>('supervise/meeting/fileList', params);
  }

  /**
   * 添加会议文件
   * @param params
   * @returns
   */
  static insertFile(params) {
    return post<any>('supervise/meeting/insertFile', params);
  }

  /**
   * 删除会议文件
   * @param params
   * @returns
   */
  static delFile(id) {
    return get<any>('supervise/meeting/delFile', { id });
  }

  /**
   * 获取邀请人员列表
   * params: 1	meetingId	机构交流会会议id	是	[string]
            2	name	姓名		[string]
            3	sendSms	是否发送短信，0:未发送1:已发送		[string]
            4	page		是	[string]
            5	pagesize
   * @returns
   */
  static meetingInviteeList(params) {
    return get<any>('sanhui/meetingInviteeList', params);
  }

  /**
             * 增加邀请人员
             * params: 1	meetingId	机构交流会会议id	是	[string]
                      2	name	姓名		[string]
                      3	mobile	手机号		[string]
                      4	duty	职位	是	[string]
                      5	orgName	机构名称	是	[string]
                      6	orgId  机构人员pid	是	[string]
              * @returns
              */
  static meetingInviteeAdd(params) {
    return post<any>('sanhui/meetingInviteeAdd', params);
  }

  /**
   * 删除邀请人员
   * params: pid
   * @returns
   */
  static delInviteUser(id) {
    return get<any>('supervise/meeting/delInviteUser', { id });
  }

  /**
             * 发送短信报名邀请
             * params: 1	meetingId	会议id	是	[string]
                      2	phoneStr	电话	是	[string]
              * @returns
              */
  static sendSmsInvitee(params) {
    return post<any>('sanhui/sendSmsInvitee', params);
  }

  /**
   * 邀请和报名人员列表人员列表
   * @param params
   * @returns
   */
  static inviteUserList(params) {
    return post<any>('supervise/meeting/inviteUserList', params);
  }
  /**
   * 插入邀请人员
   * @param params
   * @returns
   */
  static insertInviteUser(params) {
    return post<any>('supervise/meeting/insertInviteUser', params);
  }

  /**
   * 签到二维码数组
   * @returns
   */
  static qdQRList(meetingId) {
    return post<any>('supervise/meeting/QdList', { meetingId });
  }

  /**
   * 添加签到二维码
   * @returns
   */
  static insertQdQRInfo(params) {
    return post<any>('supervise/meeting/insertQdInfo', params);
  }

  /**
   * 删除签到二维码
   * @returns
   */
  static delQdQR(id) {
    return get<any>('supervise/meeting/delQd', { id });
  }

  /**
   * 签到列表
   * @param params q
   * @returns
   */
  static qiandaoList(params) {
    return post<any>('supervise/meeting/qiandaoList', params);
  }

  /**
   * 签到
   */
  static userQiandao(params) {
    return post<any>('supervise/meeting/userQiandao', params);
  }

  /**
   * 代签
   */
  static daiqianAll(params) {
    return post<any>('supervise/meeting/daiqian', params);
  }

  /**
   * 常用人员列表
   * @param params
   * @returns
   */
  static commoUserList(params) {
    return post<any>('supervise/meeting/commoUserList', params);
  }

  /**
   * 插入常用联系人
   * @param params
   * @returns
   */
  static insertCommoUser(params) {
    return post<any>('supervise/meeting/insertCommoUser', params);
  }

  /**
   * 修改常用联系人
   * @param params
   * @returns
   */
  static updateCommoUser(params) {
    return post<any>('supervise/meeting/updateCommoUser', params);
  }

  /**
   * 删除常用联系人
   * @param params
   * @returns
   */
  static delCommoUser(params) {
    return get<any>('supervise/meeting/delCommoUser', params);
  }

  /**
   * 批量添加常用联系人
   * @param params
   * @returns
   */
  static batchAddCommoUser(params) {
    return post<any>('sanhui/batchAddCommoUser', params);
  }
  /**
   * 发送报名短信
   * @param params
   * @returns
   */
  static baomingsms(params) {
    return post<any>('supervise/meeting/baomingsms', params);
  }

  /**
   * 添加报名人
   * @param params
   * @returns
   */
  static insertBaomingUser(params) {
    return post<any>('supervise/meeting/insertBaomingUser', params);
  }

  /**
   *
   * @param params 参会人员-添加参会人
   * @returns
   */
  static insertInvitee(params) {
    return post<any>('supervise/meeting/insertInvitee', params);
  }

  /**
   * 参会人员-添加参会人(批量)
   * @param params
   * @returns
   */
  static insertInvitees(params) {
    return post<any>('supervise/meeting/insertInvitees', params);
  }

  /**
   * 报名人员列表
   * @param params
   * @returns
   */
  static baomingList(params) {
    return post<any>('supervise/meeting/baomingList', params);
  }
  static commoUserListForAdd(params) {
    return post<any>('supervise/meeting/commoUserListForAdd', params);
  }
  //  线下报名
  static xianxiasms(params) {
    return post<any>('supervise/meeting/xianxiasms', params);
  }
  //  参会人导出
  static xianxiaExcel(params) {
    return get<any>('supervise/meeting/xianxiaExcel', params);
  }
  //  报名人详细信息
  static baomingDetail(id) {
    return get<any>('supervise/meeting/baomingDetail', { id });
  }

  //一键审核
  static batchAudit(params) {
    return post<any>('supervise/meeting/batchAudit', params);
  }
}
