import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SystemSourceProperty, CascaderSSPConfig } from './cascader/ssp';

export const requestHandle = (config: AxiosRequestConfig) => {
  switch (config.url) {
    case '/proxy/source/property':
      SystemSourceProperty.requestHandle(config as CascaderSSPConfig);
      break;
    default:
      break;
  }
};

export const responseHandle = (response: AxiosResponse) => {
  const config = response.config as CascaderSSPConfig;
  switch (config.proxyAjax) {
    case 'ssp':
      SystemSourceProperty.responseHandle(response);
      break;
    default:
      break;
  }
};
