/**
 * Inject 类型说明
 */

import { InjectionKey, Ref } from 'vue';
import { IQjAuth, IQjCmMeetingInfo, IQjEquityPledge, IQjInjectQjModals, IQjInjectTable, IQjOpinionWarning, IQjRoadshowInfo } from './types';

/**
 * 刷新
 */
export const InjectReloadKey: InjectionKey<Function> = Symbol('Reload');

/**
 * 侧边栏 Sidebar
 */
export const InjectSidebarKey: InjectionKey<Ref<boolean>> = Symbol('Sidebar');

/**
 * 表格 Table
 */
export const InjectTableKey: (id?: string) => InjectionKey<IQjInjectTable> = (id?: string) => {
  return Symbol.for('Table' + (id ? id : ''));
};

/**
 * QiModal 模态框
 */
export const InjectModalsKey: InjectionKey<IQjInjectQjModals> = Symbol('QjModals');
/**
 * 舆情预警页面 OwRefresh
 */
export const InjectOwRefreshKey: InjectionKey<IQjOpinionWarning> = Symbol('OwRefresh');
/**
 * 股权质押页面 EpRefresh
 */
export const InjectEpRefreshKey: InjectionKey<IQjEquityPledge> = Symbol('EpRefresh');

/**
 * 用户权限菜单
 */
export const InjectAuthMenus: InjectionKey<IQjAuth> = Symbol('InjectAuthMenus');

/**
 * 路演相关数据
 */
export const InjectRoadshowInfoKey: InjectionKey<IQjRoadshowInfo> = Symbol('RoadshowInfo');

/**
 * 会务管理缓存数据
 */
export const InjectCmMeetingKey: InjectionKey<{
  coverTemplatesLoading?: Ref<boolean>;
  roadshowCoverTemplates?: Ref<{ dictContCode: string; dictContName: string; dictContDesc: string }[]>;
}> = Symbol('CmMeetingCache');

/**
 * 交流会相关数据
 */
export const InjectCmMeetingInfoKey: InjectionKey<IQjCmMeetingInfo> = Symbol('EmMeetingInfo');
