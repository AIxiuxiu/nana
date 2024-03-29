import { useSendLogout } from '@/hooks/useSendIpc';
import { isElectronApp } from '@/utils/electron';
import { storage } from '@/utils/storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '../router';

const baseURL = !isElectronApp && import.meta.env.VITE_OPEN_PROXY === 'true' ? '/nanaProxy/' : import.meta.env.VITE_APP_nana_API_BASEURL?.toString();

const http: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

let showLoginInfo = false;

http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = !isElectronApp && import.meta.env.DEV && import.meta.env.VITE_APP_TOKEN ? import.meta.env.VITE_APP_TOKEN : storage.get('ptoken');
    //const token = 'fe67443ea16cb4ddcd1dabea5b889aec';
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (response.status === 200 && response.data) {
      // 未设置状态码则默认成功状态
      const code = response.data.code || 0;
      if (code == 0) {
        return Promise.resolve(response.data);
      } else if (code == 403) {
        if (!showLoginInfo) {
          showLoginInfo = true;
          ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              showLoginInfo = false;
              router.replace({ path: '/login' }).then(() => {
                useSendLogout();
              });
            })
            .catch(() => {
              showLoginInfo = false;
            });
        }
        return Promise.reject(response);
      } else if (response.data && response.data.message && response.data.message != '') {
        ElMessage({
          message: response.data.message,
          grouping: true,
          type: 'error'
        });
        return Promise.resolve(response.data);
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.error('网络请求地址不存在！');
          break;
        case 405:
          console.error('请求方式错误，请确认是GET还是POST');
          break;
        case 500:
          console.error('服务器错误！');
          break;
        default:
          console.error(error.response.status, error.message);
          break;
      }
    }
    return Promise.reject(error);
  }
);

export interface QjResponse<T = any> {
  [x: string]: any;
  code?: number;
  msg?: string;
  total?: number;
  data?: T;
}

interface Get {
  <T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<QjResponse<T>>;
}

interface Post {
  <T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<QjResponse<T>>;
}

interface Upload {
  <T>(url: string, formData?: object, config?: AxiosRequestConfig): Promise<QjResponse<T>>;
}

/**
 * 封装get方法
 * @param url url
 * @param params 参数
 * @param config 配置
 * @returns {Promise}
 */
export const get: Get = async (url, params, config) => http.get(url, { params, ...config });

/**
 * 封装post请求
 * @param url url
 * @param data  参数
 * @param config 配置
 * @returns {Promise}
 */
export const post: Post = async (url, data, config) => http.post(url, data, config);

/**
 * 封装上传文件
 * @param url 地址
 * @param formData formData
 * @param config 配置
 * @returns {Promise}
 */
export const upload: Upload = async (url, formData, config) => {
  config = Object.assign(config, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return http.post(url, formData, config);
};

export default http;
