import { ElMessage, ElMessageBox } from 'element-plus';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { parseQuery } from 'vue-router';
import { requestHandle, responseHandle } from '../proxy';
import broadcastMessage from '../../utils/broadcast/message';
import { Session } from '../../utils/session';
import { ssoQueryInterceptor, ssoResponseErrorInterceptor } from '../../../general/utils/query';
import { deleteQuery } from '@/utils/hashQuery';
import { h } from 'vue';

export default function (instance: AxiosInstance) {
  // 添加请求拦截器
  instance.interceptors.request.use(
    (config: AxiosRequestConfig & { replacements?: object }) => {
      let url = config.url;
      // 白名单内不校验拦截器
      if (typeof url !== 'string') {
        console.log('未配置请求url', config);
        throw new Error('未配置请求url');
      }
      // 请求代理处理函数
      requestHandle(config);
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
      console.log('全局响应拦截器', res);
      if (res.data && typeof res.data.code !== 'undefined') {
        const code = res.data.code;
        switch (code) {
          case '200':
          case 200:
          case 201:
            // 响应代理处理函数
            responseHandle(res);
            return res.data;
          case 401:
            // 登录失效删除本地缓存的系统ID
            Session.removeOrgId();
            broadcastMessage.sendMessage({
              type: 'login-failed',
              data: null,
            });
            const hashPath = deleteQuery();
            location.hash = hashPath;
            window.location.replace(
              `${res.data.data.loginURL}?ReturnUrl=${encodeURIComponent(location.href)}`,
            );
            break;
          case 406:
            ElMessage.success(res.data.message);
            throw code;
          case 480:
            ElMessageBox.alert(
              h('div', { class: 'el-message-box-confirm-body' }, [
                h('div', { class: 'el-message-box-confirm_title' }, '提示'),
                h('div', { class: 'el-message-box-confirm_content' }, `${res.data.message}`),
              ]),
              '',
              {
                confirmButtonText: '确认',
                type: 'warning',
                customClass: 'el-message-box-confirm',
              },
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
        return Promise.reject(error);
      }
      //请求超时提示
      if (error.message.includes('timeout')) {
        error.message = '请求超时，请稍后重试';
      }
      ElMessage.error(error.message);
      return Promise.reject(error);
    },
  );
}
