import { IQjTrackInfo } from '@/types/types';
import { storage } from '@/utils/storage';
import configs from './track.config';

const DEDAULT_KEY = 'vue_track_key';

/**
 * 清除埋点信息
 * @param liftTime 当设置了埋点有效期时自动清除过期埋点
 */
function clearStorage(defaultKey: string, liftTime?: number): void {
  if (liftTime) {
    const trackPoints = storage.get<IQjTrackInfo[]>(defaultKey);
    const newTrackPoints = trackPoints.filter((item: Indexable<number>) => item.eventTime > liftTime);
    storage.set(defaultKey, newTrackPoints);
  } else {
    storage.remove(defaultKey);
  }
}

// 保存埋点信息到本地
function write2Storage(defaultKey: string, trackInfo: IQjTrackInfo): void {
  const trackPoints = storage.get<IQjTrackInfo[]>(defaultKey) || [];
  trackPoints.push({ ...trackInfo });
  storage.set(defaultKey, trackPoints);
}

/**
 * 特殊情况手动埋点
 * @param trackInfo 回调函数
 * @param trackKey 时间间隔延迟多少毫秒
 */
function manualBurying(trackInfo: IQjTrackInfo, trackKey?: string): void {
  const defaultKey = trackKey || storage.get(DEDAULT_KEY);
  const info = Object.assign({}, configs.getTemplateInfo(), trackInfo);
  write2Storage(defaultKey, info);
}

export { write2Storage, clearStorage, manualBurying, DEDAULT_KEY };
