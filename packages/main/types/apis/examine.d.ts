import { AxiosRequestConfig } from 'axios';
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace WhiteList {
  export interface Instance {
    pinType: number;
    companyCode: string;
    companyName: string;
    sysName: string;
    appKey: string;
    updateTime?: string;
    status: number;
    auditTime: string;
    applyUser: string;
    applyTime: string;
    platformType: number;
    productName: string;
    hasCustomArea: number;
    companyContact: string;
    companyNumber: string;
    companyMail: string;
    id: number;
    auditMind: string;
  }
  interface MerchantInstance {
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
    scene: number;
    status: number;
    sysName: string;
    waybillCode: string;
  }
  export type submitReviewAxios = MerchantInstance;
  export interface ListQuery extends RequestForPage {
    isPage: number;
    nameOrCode?: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
    replacements?: {
      orgId: string;
    };
  };
  export interface ReviewAxios {
    params: {
      id: number;
      message: string;
      pinType: number;
      result: number;
    };
  }
  export interface queryReviewAxios {
    appKey?: string;
    id?: number;
  }
  export type commomResponse = ResponseData<Instance>;
  export type IsvResponse = ResponseData<Instance>;
  export type merchantResponse = ResponseData<MerchantInstance>;
}
