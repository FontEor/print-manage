import { ElMessage } from 'element-plus';
import axios, { AxiosRequestConfig } from 'axios';
import { parseQuery } from 'vue-router';
import { ssoQueryInterceptor, ssoResponseErrorInterceptor } from '../../general/utils/query';

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_AXIOS_PREFIX || '',
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig & { replacements?: object }) => {
    let url = config.url;
    // 白名单内不校验拦截器
    if (typeof url !== 'string') {
      throw new Error('未配置请求url');
    }
    // 替换URL参数
    if (config.replacements) {
      for (const [key, value] of Object.entries(config.replacements)) {
        url = url.replace(`{${key}}`, value);
      }
      config.url = url;
    }
    // 新 SSO 添加
    ssoQueryInterceptor(config);
    // 添加 sso_service_ticket 参数
    let search = location.search || location.href.split('?')[1] || '';
    if (search) {
      search = search.replace(/\/$/, '');
    }
    const sso_service_ticket = parseQuery(search).sso_service_ticket || '';
    config.params = {
      ...(config.params || {}),
      sso_service_ticket: sso_service_ticket,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// 添加响应拦截器
instance.interceptors.response.use(
  (res: any) => {
    console.log(res.data.code, typeof res.data.code);
    if (res.data && typeof res.data.code !== 'undefined') {
      const code = res.data.code;
      switch (code) {
        // 这是个什么code代码
        case 0:
          return res.data;
        case '200':
        case 200:
        case 201:
          // 响应代理处理函数
          return res.data;
        case 401:
          window.location.replace(
            `${res.data.data.loginURL}?ReturnUrl=${encodeURIComponent(location.href)}`,
          );
          break;
        default:
          ElMessage.error(res.data.message);
          throw code;
      }
    }
    return res;
  },
  (error) => {
    if (ssoResponseErrorInterceptor(error)) {
      return;
    }
    //请求超时提示
    if (error.message.includes('timeout')) {
      error.message = '请求超时，请稍后重试';
    }
    ElMessage.error(error.message);
    return Promise.reject(error);
  },
);
export default instance;
