import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace Business {
  export interface Instance {
    id: number;
    code: string; // 业务编码
    name: string; // 业务名称
    orgId: number; // 系统ID
    orgName: string;
    sourceId: number; // 数据源ID
    sourceName: string;
    ts: string; // 时间戳
    remark: string; // 备注
    isDelete: number; // 是否删除: 0：未删除 1：已删除
    createTime: string; // 创建时间
    createUser: string; // 创建人
    updateTime: string;
    updateUser: string;
    version: number;
  }

  // 列表接口
  export interface ListQuery extends RequestForPage {
    isPage: number;
    orgId?: string;
    name?: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
  };
  export type ListResponse = ResponseDataForPage<Instance>;

  // 本系统与祖先级系统列表
  export interface ParentsListQuery extends RequestForPage {
    orgId: string;
  }
  export type ParentsListQueryAxios = {
    params: ParentsListQuery;
  };

  // 创建接口
  export interface CreateData {
    id?: number;
    code: string;
    orgId: string; // 系统ID
    remark: string; // 备注
    sourceId: string; // 数据源ID
    type: string; // 类型
  }
  export type CreateAxios = {
    params: CreateData;
  };
  export type CreateResponse = ResponseData<Instance>;

  // 修改接口
  export type ChangeAxios = {
    data: CreateData;
  };
  export type ChangeResponse = ResponseData<Instance>;

  // 删除
  export type DeleteAxios = {
    params: {
      id: number;
      code: string;
    };
  };
  export type DeleteResponse = ResponseData<Instance>;

  // 详情
  export type DetailQueryAxios = {
    params: {
      code: string;
      name: string;
      orgId: string; // 系统ID
    };
  };
  export type DetailResponse = ResponseData<Instance>;
}
