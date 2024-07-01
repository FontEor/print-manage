import { ResponseDataForPage } from '../response';

// 获取可申请加入系统列表
export namespace JoinSystem {
  export interface Instance {
    id: number;
    name: string;
    code: string;
    owner: string;
    remark: string;
    createTime: string;
    isApprove: boolean;
  }
  export type ListQuery = {
    name: string;
  };
  export type ListAxios = {
    params: ListQuery;
  };
  export type ListResponse = ResponseDataForPage<Instance>;

  // 申请加入系统
  export interface ApplyToJoinSystemQuery {
    data: {
      code: string;
      name: string;
      description?: string;
    };
  }
}

export namespace SystemList {
  export interface Instance {
    id: number;
    name: string;
    code: string;
  }
  export type ListResponse = ResponseDataForPage<Instance>;
  export type OrgForm = {
    orgId?: number;
    orgName?: string;
  };
}

// 校验用户是否在usf权限平台注册
export namespace Register {
  export type RegisterResponse = ResponseData;
}
