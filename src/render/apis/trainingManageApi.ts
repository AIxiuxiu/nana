import { get, post, upload } from './requestnana';

//封装 路演 接口方法
export class TrainingManageApi {
  /**
   * 获取课程列表
   * @returns
   */
  static getcourselist(platform, params) {
    return get<any>(`${platform}/api/courses/getcourselist`, params);
  }

  /**
   * 创建课程
   * @param platform
   * @param params
   * @returns
   */
  static createCourseinfo(platform, params) {
    return post<any>(`${platform}/api/courses/createcourseinfo`, params);
  }
  /**
   * 删除课程
   */
  static deleteCourse(platform, params) {
    return post<any>(`${platform}/api/courses/deletecoursebyid`, params);
  }

  /**
   * 课程详情
   * @param platform
   * @param params
   * @returns
   */
  static getcoursesinfo(platform, params) {
    return get<any>(`${platform}/api/courses/getcoursesinfo`, params);
  }

  /**
   * 发布/下线课程
   * @param platform
   * @param params
   * @returns
   */
  static changeTrainingStatus(platform, params) {
    return post<any>(`${platform}/api/courses/ispublish`, params);
  }

  /**
   * 学员维护列表(课程白名单列表)
   */
  static getCourseMembers(platform, params) {
    return get<any>(`${platform}/api/courses/getcoursemembers`, params);
  }

  /**
   * 课程添加白名单成员
   * @param params
   * @returns
   */
  static addCourseMember(platform, params) {
    return post<any>(`${platform}/api/courses/addCourseMember`, params);
  }

  /**
   * 删除课程白名单
   * @param platform
   * @param params
   * @returns
   */
  static deleteCourseMember(platform, params) {
    return post<any>(`${platform}/api/courses/deletecoursemember`, params);
  }

  /**
   * 课程 清空白名单人员
   * @param platform
   * @param params
   * @returns
   */
  static cleanCourseMember(platform, params) {
    return post<any>(`${platform}/api/courses/cleanCourseMember`, params);
  }

  /**
   * 课程 导入白名单成员
   * @param platform
   * @param params
   * @returns
   */
  static importCourseMember(platform, formData, config) {
    return upload(`${platform}/api/courses/importCourseMember`, formData, config);
  }
  /**
   * 课程分类
   * @param platform
   * @returns
   */
  static getCategory(platform, params) {
    return get<any>(`${platform}/api/courses/getcategory`, params);
  }

  /**
   *  添加白名单候选人员列表(课程)
   * @param platform
   * @param params
   * @returns
   */
  static getUserlist(platform, params) {
    return get<any>(`${platform}/api/courses/getuserlist`, params);
  }

  /**
   * 单个课程信息统计
   * @param platform
   * @param params
   * @returns
   */
  static getOneCoursestatistics(platform, params) {
    return get<any>(`${platform}/api/courses/getonecoursestatistics`, params);
  }

  /**
   * 课程统计列表(上面统计数字)
   * @param platform
   * @param params
   * @returns
   */
  static getCoursestatistics(platform, params) {
    return get<any>(`${platform}/api/courses/getcoursestatistics`, params);
  }

  /**
   * 添加/修改课程分类
   * @param platform
   * @param params
   * @returns
   */
  static addcategory(platform, params) {
    return post<any>(`${platform}/api/courses/createcategory`, params);
  }

  /**
   * 删除课程分类
   * @param platform
   * @param params
   * @returns
   */
  static deletecategory(platform, params) {
    return post<any>(`${platform}/api/courses/deletecategory`, params);
  }

  /**
   * 用户管理 获取用户列表
   * @param platform
   * @param params
   * @returns
   */
  static getUserlist_user(platform, params) {
    return get<any>(`${platform}/api/user/getuserlist`, params);
  }

  /**
   * 用户管理 更新用户状态
   * @param platform
   * @param params
   * @returns
   */
  static updateUserStatus(platform, params) {
    return post<any>(`${platform}/api/user/updateUserStatus`, params);
  }

  /**
   * 用户管理 添加用户
   * @param platform
   * @param params
   */
  static addUser(platform, params) {
    return post<any>(`${platform}/api/user/addUser`, params);
  }

  /**
   * 用户管理 修改用户
   * @param platform
   * @param params
   * @returns
   */
  static updateuserinfo(platform, params) {
    return post<any>(`${platform}/api/user/updateuserinfo`, params);
  }

  /**
   * 用户管理 导入用户
   * @param platform
   * @param params
   * @returns
   */
  static importUser(platform, formData, config) {
    return upload(`${platform}/api/user/importuser`, formData, config);
  }

  /**
   * 课程管理统计列表
   * @param platform
   * @param params
   * @returns
   */
  static getonecoursememberlist(platform, params) {
    return get<any>(`${platform}/api/courses/getonecoursememberlist`, params);
  }

  /**
   * 辖区内查询上市公司
   * @param platform
   * @returns
   */
  static getcompanykeywords(platform) {
    return get<any>(`${platform}/api/train/getcompanykeywords`);
  }

  /**
   * 获取待审核用户列表
   * @param platform
   * @param params
   * @returns
   */
  static getaudituserlist(platform, params) {
    return get<any>(`${platform}/api/user/getaudituserlist`, params);
  }

  /**
   * 审核注册用户
   * @param platform
   * @param params
   * @returns
   */
  static auditUser(platform, params) {
    return post<any>(`${platform}/api/user/auditUser`, params);
  }

  /**
   * 报名审核
   * @param platform
   * @param params
   * @returns
   */
  static auditcoursemember(platform, params) {
    return post<any>(`${platform}/api/courses/auditcoursemember`, params);
  }

  /**
   * 证书列表
   * @param platform
   * @param params
   * @returns
   */
  static certList(platform, params) {
    return get<any>(`${platform}/api/cert/list`, params);
  }

  /**
   * 查看证书详情
   * @param platform
   * @param id
   * @returns
   */
  static certDetail(platform, id) {
    return get<any>(`${platform}/api/cert/detail/${id}`);
  }

  /**
   * 添加证书
   * @param platform
   * @param params
   * @returns
   */
  static certAdd(platform, params) {
    return post<any>(`${platform}/api/cert/add`, params);
  }

  /**
   * 更新证书
   * @param platform
   * @param id
   * @param params
   * @returns
   */
  static certUpdate(platform, id, params) {
    return post<any>(`${platform}/api/cert/detail/${id}`, params);
  }

  /**
   * 删除证书
   * @param platform
   * @param params
   * @returns
   */
  static certDel(platform, params) {
    return post<any>(`${platform}/api/cert/del`, params);
  }

  /**
   * 证书批量导入
   * @param platform
   * @param id
   * @param params
   * @returns
   */
  static certImport(platform, id, params) {
    return post<any>(`${platform}/api/cert/import/${id}`, params);
  }

  /**
   * 证书批量导入的错误列表（下载）
   * @param platform
   * @param params
   * @returns
   */
  static certImportError(platform, params) {
    return get<any>(`${platform}/api/cert/import/get/error`, params);
  }

  /**
   * 批量生成证书pdf和图片
   * @param platform
   * @param params
   * @returns
   */
  static certGen(platform, params) {
    return post<any>(`${platform}/api/cert/gen`, params);
  }

  /**
   * [预览] 生成证书
   * @param platform
   * @param params
   * @returns
   */
  static certPreview(platform, params) {
    return get<any>(`${platform}/api/cert/preview`, params);
  }

  /**
   * 证书模板列表
   * @param platform
   * @param params
   * @returns
   */
  static certTemplateList(platform, params) {
    return get<any>(`${platform}/api/cert/template/list`, params);
  }

  /**
   * [查看] 证书模板详情
   * @param platform
   * @param id
   * @returns
   */
  static certTemplateDetail(platform, id) {
    return get<any>(`${platform}/api/cert/template/detail/${id}`);
  }

  /**
   * [添加] 证书模板详情
   * @param platform
   * @param params
   * @returns
   */
  static certTemplateAdd(platform, params) {
    return post<any>(`${platform}/api/cert/template/detail/0`, params);
  }

  /**
   * [更新] 证书模板详情
   * @param platform
   * @param id
   * @param params
   * @returns
   */
  static certTemplateUpdate(platform, id, params) {
    return post<any>(`${platform}/api/cert/template/detail/${id}`, params);
  }

  /**
   * 复制证书模板
   * @param platform
   * @param id
   * @returns
   */
  static certTemplateDuplicate(platform, id) {
    return post<any>(`${platform}/api/cert/template/duplicate/${id}`);
  }
}
