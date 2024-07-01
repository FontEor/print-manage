import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace SystemData {
  // 基本实例结构
  export interface Instance {
    id: number;
    code: string;
    type: number;
    codeOrName: string;
    createTime: string;
    createUser: string;
    isDelete: number;
    isOpen: number;
    members: string;
    membersName: string;
    name: string;
    owner: string;
    ownerDep: string;
    ownerName: string;
    pin: string;
    remark: string;
    ts: string;
    type: number;
    updateTime: string;
    updateUser: string;
    version: number;
    deptName: string;
    hasSource: number;
    hasPublishTemp: number;
    channels: string;
  }
  export interface IdParams {
    id: number;
  }
  // 查询列表
  export interface ListQuery extends RequestForPage {
    codeOrName: string;
    owner: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
    replacements: IdParams;
  };
  export type ListNoPageAxios = {
    params: {
      isPage: number;
      codeOrName?: string;
    };
  };

  export type ListNoPageResponse = ResponseData<Instance>;
  export interface ListQuery {
    codeOrName: string;
    owner: string;
  }
  export type ListResponse = ResponseDataForPage<Instance>;

  //创建接入系统
  export interface CreateData {
    parentId: number | null;
    code: string;
    isOpen: number;
    members: string;
    membersName: string;
    name: string;
    owner: string;
    ownerDep: string;
    ownerName: string;
    remark: string;
    channels: string;
  }
  export type CreateAxios = {
    data: CreateData;
  };
  export type CreateResponse = ResponseData<Instance>;

  // 查询系统详情概览
  export type DetailQuery = {
    id: number;
  };
  export type DetailQueryAxios = {
    replacements: DetailQuery;
  };
  export type DetailResponse = ResponseData<Instance>;

  // 修改系统信息
  export interface UpdateData {
    parentId: number | null;
    code: string;
    isOpen: number;
    type: number;
    members: string;
    memberDisplay?: string;
    membersName: string;
    name: string;
    owner: string;
    ownerDep: string;
    ownerName: string;
    remark: string;
  }
  export type UpdateAxios = {
    data: UpdateData;
    replacements: DetailQuery;
  };
  export type UpdateResponse = ResponseData<Instance>;

  // 删除系统
  export interface DeleteData {
    checkFlag: number;
  }
  export type DeleteAxios = {
    params: DeleteData;
    replacements: DetailQuery;
  };
  export type DeleteResponse = ResponseData<Instance>;
}
