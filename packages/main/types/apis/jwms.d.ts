// /custom/orgs/{id}/customsJwms
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';
import { openTemplateData } from './openTemplateData';
import { Custom } from './custom';
import { Version } from './version';

export namespace JWMS {
  // URL 过来的参数
  export interface LocationSearch {
    orgId: string;
    tempType: string;
    temId: string;
    cId: string;
    sourceId: string;
    verId: string;
    bT: string;
    s: string;
    hasCustom: string;
    isPublish: string;
    deliveryCode: string;
  }
  export interface TemplateCreate {
    sourceId: string;
    deliveryCode: string;
    orgId: string | number;
  }
  export interface CustomCreate extends TemplateCreate {
    tempId: string | number;
  }
  export type TemplateCreateAxios = {
    data: TemplateCreate;
    replacements: {
      orgId: string;
    };
  };
  export type CustomCreateAxios = {
    data: CustomCreate;
    replacements: {
      orgId: string;
    };
  };
  export type TemplateCreateResponse = ResponseData<openTemplateData.Instance>;
  export type CustomCreateResponse = ResponseData<Custom.Instance>;

  export type TransfromAxios = {
    replacements: {
      id: string;
      temId: string;
    };
  };
  export interface TransfromResult {
    jwmsImage: string;
    image: string;
  }
  export type TransfromResponse = ResponseData<TransfromResult>;

  export interface TransformSave {
    sourceId: string; // 数据源ID
    isPublish: string; //是否发布
    verId: string; // 版本ID
  }
  export type TransformSaveAxios = {
    replacements: {
      orgId: string; // 组织ID
      temId: string; // 标准模版ID
    };
    params: TransformSave;
  };
  export type TransformSaveResponse = ResponseData<Version.Instance>;
}
