import { AxiosRequestConfig, AxiosInstance } from 'axios';
import cloudPrintAxios from '../intercepts/cloud-print';
import manageNewAxios from '../intercepts/manage-new';

export const wrapRequest = function (
  wrapOptions: AxiosRequestConfig,
  format?: (data: any) => any,
  instance: AxiosInstance = cloudPrintAxios,
) {
  return (options?: AxiosRequestConfig & any): Promise<any> => {
    return instance(Object.assign(options || {}, wrapOptions)).then((response) => {
      if (format) {
        return format(response);
      }
      return response;
    });
  };
};

export const wrapRequestV2 = function (
  wrapOptions: AxiosRequestConfig,
  format?: (data: any) => any,
  instance: AxiosInstance = manageNewAxios,
) {
  return (options?: AxiosRequestConfig & any): Promise<any> => {
    return instance(Object.assign(options || {}, wrapOptions)).then((response) => {
      if (format) {
        return format(response);
      }
      return response;
    });
  };
};
