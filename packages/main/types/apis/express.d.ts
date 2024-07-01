import { AxiosRequestConfig } from 'axios';
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace Express {
  export interface Instance {
    code: string;
    createTime: string;
    createUser: string;
    deliveryNum: string;
    id: number;
    isDelete: number;
    logoPath: string;
    name: string;
    remark: string;
    ts: string;
    updateTime: string;
    updateUser: string;
    version: number;
    path: string;
  }

  export interface CreateData {
    id?: number;
    code: string; // 承运商编码
    deliveryNum: string; // 承运商ID号码
    logoPath: string; // 承运商logo图
    name: string; // 承运商名称
    remark: string; // 备注
  }

  export interface ChangeData {
    id: number;
    logoPath: string; // 承运商logo图
    name: string; // 承运商名称
    remark: string;
  }

  // 列表接口
  export interface ListQuery extends RequestForPage {
    isPage: number;
    nameOrCode: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
    replacements: {
      orgId: string;
    };
  };
  export type ListResponse = ResponseDataForPage<Instance>;

  // 承运商维护
  interface InstanceRelation extends Instance {
    relation: string;
  }

  export type ListRelationResponse = ResponseDataForPage<InstanceRelation>;

  // 关联接口
  export interface RelationUpdate {
    relation: string;
    deliveryId: string | number;
  }
  export type RelationAxios = {
    data: RelationUpdate[];
    replacements: {
      orgId: string;
    };
  };
  export type RelationResponse = ResponseData<Instance>;

  // 创建接口
  export type CreateAxios = {
    data: CreateData;
  };
  export type CreateResponse = ResponseData<Instance>;

  // 修改接口
  export type ChangeAxios = {
    data: ChangeData;
  };
  export type ChangeResponse = ResponseData<Instance>;

  // 删除
  export type DeleteAxios = {
    replacements: {
      deliveryId: number;
    };
  };
  export type DeleteResponse = ResponseData<Instance>;

  // 详情
  export type DetailAxios = {
    replacements: {
      deliveryId: number;
    };
  };
  export type DetailResponse = ResponseData<Instance>;

  // 上传
  export type UploadLogoAxios = {
    data: FormData;
  };

  export type UploadLogoResponse = ResponseData<Instance>;
}
