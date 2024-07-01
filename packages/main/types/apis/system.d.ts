import { ResponseDataForPage } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace System {
  export interface Instance {
    createUser: string;
    updateUser: string;
    createTime: string;
    updateTime: string;
    ts: string;
    version: number;
    isDelete: number;
    id: number;
    name: string;
    code: string;
    type: number;
    owner: string;
    ownerDep: string;
    isOpen: number;
    remark: string | null;
    codeOrName: string | null;
    members: string | null;
    pin: string | null;
  }

  export interface IdParams {
    id: string;
  }
  // 列表相关
  export interface ListQuery extends RequestForPage {
    owner: string;
    isPage: number;
    codeOrName: string;
    queryOrgIdFlag: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
    replacements: IdParams;
  };
  export type ListResponse = ResponseDataForPage<Instance>;
}
