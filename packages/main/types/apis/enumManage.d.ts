import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace EnumsManage {
  export interface Instance {
    id: number;
    orgId: number; // 系统ID
    enumCode: string; // 枚举编码 50
    enumName: string; // 枚举名称 50
    enumValue: string; // 枚举值 500
    createUser: string; // 创建人
    updateUser: string; // 修改人
    createTime: string; // 创建时间
    updateTime: string; // 修改时间
    ts: string; // 时间戳
    version: number; // 版本
    isDelete: number; // 0未删除  1已删除
    enumCode: string;
  }
  // 列表查询
  export interface ListQuery extends RequestForPage {
    nameOrCode: string;
    isPage: number;
    orgId: number | string;
  }

  export interface ListAxios {
    params: ListQuery;
  }

  export type ListResponse = ResponseDataForPage<Instance>;

  // 导入
  export interface ImportAxios {
    replacements: {
      orgId: number | string;
    };
    data: string;
  }

  export type ImportResponse = ResponseData<null>;

  export interface UpdateData {
    enumCode: string;
    enumName: string; // 枚举名称 50
    enumValue: string; // 枚举值 500
  }
  // 编辑
  export interface UpdateAxios {
    replacements: {
      orgId: number | string;
      enumId: number | string;
    };
    data: UpdateData;
  }

  export type UpdateResponse = ResponseData<null>;

  // 删除
  export interface DeleteAxios {
    replacements: {
      orgId: number;
      enumId: number;
    };
  }

  export type DeleteResponse = ResponseData<null>;

  // 详情
  export type DetailAxios = {
    replacements: {
      orgId: number;
      enumId: number;
    };
  };
  export type DetailResponse = ResponseData<Instance>;
}
