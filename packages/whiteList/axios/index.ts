import { AxiosRequestConfig } from 'axios';
import axios from './interceptor';
import { WhiteListRequest } from '../types/request';

const wrapRequest = function (wrapOptions: AxiosRequestConfig, format?: Function) {
  return (options?: AxiosRequestConfig & any): Promise<any> => {
    return axios(Object.assign(options || {}, wrapOptions)).then((response) => {
      if (format) {
        return format(response);
      }
      return response;
    });
  };
};

// 请求定义位置
export const request: WhiteListRequest.request = {
  // 审核单列表
  // whiteExamineList: wrapRequest({ url: '/whiteLists', method: 'get' }),
  // 根据传入的运单号生成模板并存入oss，返回地址
  whiteGenerateTemplate: wrapRequest({ url: '/whiteLists/generateTemplate', method: 'post' }),
  // // 外部查询审核单列表
  whiteExamineOuterList: wrapRequest({ url: '/whiteLists/list/out', method: 'get' }),
  // 外部审核单详情
  whiteExamineOuterDetail: wrapRequest({ url: '/whiteLists/query/out', method: 'get' }),
  // // isv认证查询产品列表接口
  // whiteISVProductList: wrapRequest({ url: '/whiteLists/queryProductList', method: 'get' }),
  // // 根据appKey查询审核单详情
  // whiteExamineDetailByAppKey: wrapRequest({ url: '/whiteLists/queryReview', method: 'get' }),
  // // 审核
  // whiteExamine: wrapRequest({ url: '/whiteLists/review', method: 'get' }),
  // 商家信息认证
  whiteBusinessFirm: wrapRequest({ url: '/whiteLists/reviewMerchantInfo', method: 'post' }),
  // // 商家白名单撤销审核
  whiteBusinessRevokeExamine: wrapRequest({ url: '/whiteLists/revokeSubmit', method: 'post' }),
  // 商家白名单提交审核
  whiteBusinessSubmitExamine: wrapRequest({ url: '/whiteLists/submitReview', method: 'post' }),
  // 待认证的图片文件上传oss /whiteLists/upload
  whiteExamineFileUpload: wrapRequest({ url: '/whiteLists/upload', method: 'post' }),
};
