import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace SourceData {
  // 基本实例结构
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
    orgId: number;
    orgName: string;
    orgCode: string;
    code: string;
    remark: string;
  }
  export interface IdParams {
    id?: number;
  }
  // 列表相关
  export interface ListQuery extends RequestForPage {
    id?: number;
    isPage: number;
    nameOrCode: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
  };
  export type ListResponse = ResponseDataForPage<Instance>;

  // 详情相关
  export interface DetailQuery extends IdParams {
    sourceId: string;
  }
  export type DetailQueryAxios = {
    replacements: DetailQuery;
  };
  export type DetailResponse = ResponseData<Instance>;

  // 创建相关
  export type CreateData = {
    code: string;
    jsonString: object | null;
    name: string;
    remark: string;
  };
  export type CreateAxios = {
    data: CreateData;
    replacements: IdParams;
  };

  export type CreateResponse = DetailResponse;

  // 修改相关
  export type ChangeData = {
    name: string;
    remark: string;
  };
  export type ChangeAxios = {
    data: ChangeData;
    replacements: DetailQuery;
  };

  export type ChangeResponse = DetailResponse;

  // 删除
  export type DeleteAxios = {
    replacements: DetailQuery;
  };
  export type DeleteResponse = DetailResponse;
}

export namespace Property {
  // 实例
  export interface InstanceBySource {
    id: number;
    orgId: number;
    propertyCode: string;
    propertyName: string;
    dataType: number;
    remark: string | null;
    path: string | null;
    hasChildren?: boolean;
    children?: Instance[];

    sourceId: number;
    enumItemId: number; // 枚举项ID
    enumItemName: string; // 枚举项名称
  }
  export interface Instance {
    createUser: string;
    updateUser: string;
    createTime: string;
    updateTime: string;
    ts: string;
    version: number;
    isDelete: number;
    id: number;
    sourceId: number;
    propertyCode: string;
    propertyName: string;
    dataType: number;
    remark: string | null;
    simpData: string;
    path: string | null;
    parentId: number;
    // 对象扩展字段
    orgId: undefined; // 接口本身不返回此字段
    children?: Instance[]; // 接口本身不返回此字段
    $index: string; // 接口本身不返回此字段
    // hasChildren: boolean; // 接口本身不返回此字段
    enumItemId: number; // 枚举项ID
    enumItemName: string; // 枚举项名称
    enumCode?: number;
  }
  export interface IdParams {
    id?: number;
  }
  export interface SourceParams extends IdParams {
    sourceId: string;
  }
  export interface ProParams extends SourceParams {
    proId: number;
  }
  // 创建
  export interface CreateData {
    dataType: number;
    parentId: number;
    propertyCode: string;
    propertyName: string;
    remark: string;
    simpData: string;
  }
  export type CreateDataAxios = {
    data: CreateData;
    replacements: SourceParams;
  };
  export type CreateResponse = ResponseData<Instance>;
  // 修改
  export interface ChangeData {
    dataType: number;
    id: number;
    propertyName: string;
    remark: string;
    simpData: string;
  }
  export type ChangeDataAxios = {
    data: ChangeData[];
    replacements: SourceParams;
  };
  export type ChangeResponse = ResponseData<Instance>;
  // 详情
  export type DetailQueryAxios = {
    replacements: ProParams;
  };
  export type DetailResponse = ResponseData<Instance>;
  // 删除
  export type DeleteAxios = {
    replacements: ProParams;
  };
  export type DeleteResponse = ResponseData<Instance>;
  // 导入
  // export interface ImportData {
  //   jsonString: string;
  // }
  export interface ImportQuery {
    parentId: number;
  }
  export type ImportAxios = {
    data: string;
    replacements: SourceParams;
    params: ImportQuery;
  };
  export type ImportResponse = ResponseData<Instance>;
  // 列表
  export interface ListQuery {
    parentId: string;
    propertyCodeAndName: string;
  }
  export type ListAxios = {
    params: ListQuery;
    replacements: SourceParams;
  };
  export type ListResponse = ResponseDataForPage<Instance>;

  // 关联枚举
  export interface RelationEnumData {
    bindStatus: 0 | 1;
    enumItemId: number;
    id: number;
  }

  export type RelationEnumAxios = {
    replacements: {
      orgId: string | number;
      sourceId: string | number;
    };
    data: RelationEnumData;
  };

  export type RelationEnumResponse = ResponseData<null>;
}
