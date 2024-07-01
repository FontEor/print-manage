import { RequestForPage } from '../../../main/types/request/requestV1';
import { ResponseData, ResponseDataForPage } from '../../../main/types/response';

export namespace WhiteList {
  export interface Instance {
    appKey: string;
    applyTime: string;
    applyUser: string;
    auditMind: string;
    auditTime: string;
    auditUser: string;
    companyCode: string;
    companyContact: string;
    companyMail: string;
    companyMerchantCode: string;
    companyName: string;
    companyNumber: string;
    generateTempUrl: string;
    hasCustomArea: number;
    id: number;
    imageUrl: string;
    pin: string;
    pinType: number;
    platformType: number;
    productName: string;
    productNames: string[];
    scene: number;
    status: number;
    sysName: string;
    waybillCode: string;
  }

  export interface ListQuery extends RequestForPage {
    pinType: 1; // 客户类型
    scene: number; // 场景
    isPage: 0; // 不分页请求
  }

  export type ListQueryAxios = {
    params: ListQuery;
  };

  export type ListResponse = ResponseData<Instance[]>;

  export interface SubmitExamine {
    companyName: string; // 企业名称
    companyCode: string; // 企业社会信用代码
    companyMerchantCode: string; // 企业商家编码
    companyContact: string; // 企业联系人
    companyNumber: string; // 企业联系电话
    companyMail: string; // 企业邮箱
    platformType: number; // 平台类型 0：JOS平台 1：京东物流开放平台
    appKey: string;
    sysName: string; // 系统名称
    waybillCode: string; // 运单号
    hasCustomArea: number; // 0 否 1是
    imageUrl: string; // 用户上传图片URL

    pinType: 1; // 客户类型 0：isv  1：商家
    scene: number; // 场景枚举
    //  1-自营仓配快递
    //  2-自营仓配快运
    //  3-自营仓配大件
    //  4-外单纯配快递
    //  5-外单纯配快运
    //  6-外单纯配大件
    //  7-外单仓配快递
    //  8-外单仓配快运
    generateTempUrl: string; // 生成的模板URL
    auditMind?: string; // 审核意见
    status?: number; // 状态 0：待审核   1：审核未通过  2： 审核通过  3：撤回
    id?: number;
  }

  export interface SubmitExamineAxios {
    data: SubmitExamine;
  }

  export type SubmitExamineResponse = ResponseData<number>;

  export interface BusinessFirmData {
    companyName: string; // 企业名称
    companyCode: string; // 企业社会信用代码
    companyMerchantCode: string; // 企业商家编码
    scene: number; // 场景枚举
  }

  export interface BusinessFirmAxios {
    data: BusinessFirmData;
  }

  export type BusinessFirmResponse = ResponseData<null>;

  export interface GeneratorTemplate {
    appKey: string;
    companyMerchantCode: string;
    scene: number;
    waybillCode: string;
  }

  export interface GeneratorTemplateAxios {
    data: GeneratorTemplate;
  }

  export type GeneratorTemplateResponse = ResponseData<string>;

  export interface ExamineFileUpload extends FormData {
    append(name: 'file', value: Blob, fileName?: string): void;
    append(name: 'appKey', value: string, fileName?: string): void;
    append(name: 'scene', value: string, fileName?: string): void;
  }

  export interface ExamineFileUploadAxios {
    data: ExamineFileUpload;
  }

  export type ExamineFileUploadResponse = ResponseData<string>;

  export interface Id {
    id: number;
  }

  export interface ExamineDetailAxios {
    params: Id;
  }

  export type ExamineDetailResponse = ResponseData<Instance>;

  export interface BusinessRevokeExamineAxios {
    params: Id;
  }

  export type BusinessRevokeExamineResponse = ResponseData<null>;
}
