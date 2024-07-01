import { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

interface SSOQuery {
  state?: string | string[];
  code?: string | string[];
}

// 获取 页面query数据
let getQuery: () => SSOQuery = function () {
  const search = location.search;
  let query: SSOQuery | undefined = undefined;
  if (search) {
    const queryS = search.slice(1);
    query = qs.parse(queryS);
  }
  getQuery = function () {
    return query || {};
  };
  return getQuery();
};

const ssoQueryInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  config.headers['callback'] = location.origin + location.pathname + location.search;
  const query = getQuery();
  if (query.code) {
    if (query.code instanceof Array) {
      query.code = query.code.pop();
    }
    if (query.state instanceof Array) {
      query.state = query.state.pop();
    }
    if (config.params) {
      config.params.code = query.code;
      config.params.state = query.state;
    } else {
      config.params = {
        code: query.code,
        state: query.state,
      };
    }
  }
  return config;
};

const ssoResponseErrorInterceptor = (error: any): boolean => {
  const response: AxiosResponse = error.response;
  if (response?.status === 401) {
    const targetUrl: string = response.headers.location;
    if (targetUrl) {
      location.href = targetUrl;
      return true;
    }
  }
  return false;
};

export { getQuery, ssoQueryInterceptor, ssoResponseErrorInterceptor };
