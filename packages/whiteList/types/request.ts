import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { WhiteList } from './apis/whiteList.d';

export namespace WhiteListRequest {
  export interface request {
    // 审核单列表
    // whiteExamineList:(options: WhiteList.ListQueryAxios & AxiosRequestConfig) => Promise<WhiteList.ListResponse>;
    // 根据传入的运单号生成模板并存入oss，返回地址
    whiteGenerateTemplate: (
      options: WhiteList.GeneratorTemplateAxios & AxiosRequestConfig,
    ) => Promise<WhiteList.GeneratorTemplateResponse>;
    // // 外部查询审核单列表
    whiteExamineOuterList: (
      options: WhiteList.ListQueryAxios & AxiosRequestConfig,
    ) => Promise<WhiteList.ListResponse>;
    // 外部审核单详情
    whiteExamineOuterDetail: (
      options: WhiteList.ExamineDetailAxios & AxiosRequestConfig,
    ) => Promise<WhiteList.ExamineDetailResponse>;
    // // isv认证查询产品列表接口
    // whiteISVProductList: (options: AxiosRequestConfig) => Promise<WhiteList.Response>;
    // // 根据appKey查询审核单详情
    // whiteExamineDetailByAppKey: (options: AxiosRequestConfig) => Promise<WhiteList.Response>;
    // // 审核
    // whiteExamine: (options: AxiosRequestConfig) => Promise<WhiteList.Response>;
    // 商家信息认证
    whiteBusinessFirm: (
      options: WhiteList.BusinessFirmAxios & AxiosRequestConfig,
    ) => Promise<WhiteList.BusinessFirmResponse>;
    // // 商家白名单撤销审核
    whiteBusinessRevokeExamine: (
      options: WhiteList.BusinessRevokeExamineAxios & AxiosRequestConfig,
    ) => Promise<WhiteList.BusinessRevokeExamineResponse>;
    // 商家白名单提交审核
    whiteBusinessSubmitExamine: (
      options: WhiteList.SubmitExamineAxios & AxiosRequestConfig,
    ) => Promise<WhiteList.SubmitExamineResponse>;
    // 待认证的图片文件上传oss /whiteLists/upload
    whiteExamineFileUpload: (
      options: WhiteList.ExamineFileUploadAxios & AxiosRequestConfig,
    ) => Promise<WhiteList.ExamineFileUploadResponse>;
  }
}
