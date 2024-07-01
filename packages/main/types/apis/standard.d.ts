// /orgs/tempOrgs
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace Standard {
  // 基本实例结构
  export interface Instance {
    createTime: string;
    createUser: string;
    deliveryCode: string;
    hasCustom: number;
    id: number;
    isDelete: number;
    orgId: number;
    tempId: string;
    tempCode: string;
    tempName: string;
    ts: string;
    updateTime: string;
    updateUser: string;
    version: number;
    coverImage: string;
    sourceId: string;
    code: string;
  }

  export interface IdParams {
    id: number;
  }

  // 查询列表
  export interface ListQuery extends RequestForPage {
    deliveryCode: string;
    hasCustom?: string;
    orgId: string;
    tempCode: string;
    isPage?: number;
  }

  export type ListQueryAxios = {
    params: ListQuery;
  };

  export type ListResponse = ResponseDataForPage<Instance>;

  //创建接入系统
  export interface CreateData {
    sourceId: string; // 数据源ID
    param: number; //
    members: string;
    name: string;
    owner: string;
    ownerDep: string;
    remark: string;
  }

  export type CreateAxios = {
    data: CreateData;
  };

  export type CreateResponse = ResponseData<Instance>;

  export interface UserListQuery extends RequestForPage {
    deliveryCode: string;
    hasCustom: number;
    orgId: number;
    tempCode: string; // 标准模板编码
  }

  export type UserListQueryAxios = {
    params: UserListQuery;
  };

  export interface CreateUserTemplateInfo {
    customTempCode?: string; // 自定义区-模板编码
    customTempName?: string; // 自定义区-模板名称
    des?: string; // 自定义区-备注
    isPage?: number; // 自定义区-是否分页 0：否 1：是
    sourceId: string;
  }

  export interface CreateUserTemplateRelation extends CreateUserTemplateInfo {
    createUser: string; // 创建人
    deliveryCode: string; // 标准模板承运商编码
    specifId: number; //
    hasCustom: number; // 自定区标识 0：不带自定义区 1：带自定义区
    height: number; // 标准模板-高 (单位 mm)
    tempCode: string; // 标准模板编码
    tempId: string; // 标准模板主键id
    width: number; // 标准模板-宽 (单位 mm)
    sourceId: string; // 数据源ID
    justBind?: number; // 是否仅绑定 自定义区模板 直接绑定 不创建使用
  }

  export type CreateUserTemplateRelationAxios = {
    replacements: {
      orgId: string;
    };
    data: CreateUserTemplateRelation;
  };

  export type CreateUserTemplateRelationResponse = ResponseData<Instance>;
}
