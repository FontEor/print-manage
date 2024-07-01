import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace elementData {
  // 基本实例结构
  export interface Instance {
    id: string;
    orgId: number; //系统id
    code: string; //模板编码
    name: string; // 要素名称
    sourceId: string; // 数据源ID
    elementType: string;
    valueType: number;
    createUser: string;
    createTime: string;
    updateTime: string; //更新时间
    updateUser: string; //更新人ERP
    height: number; //高
    width: number; //宽
    fontSize: number; //字号，
    remark: string;
    cascaderValue: string;
    cascaderLabel: string;
    hasChild: number;
    dataType: number;
    path: string;
    propertyPath: string;
    fixedValue: string;
    parentIds: Array;
    required: number;
  }
  export interface IdParams {
    elementId: string;
  }
  export interface OptionParams {
    id: string;
    sourceId: string;
  }
  export interface SourceParams {
    id: string;
    isPage: number;
  }
  // 查询列表
  export interface ListQuery extends RequestForPage {
    orgId: string;
    name: string;
    sourceId: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
  };
  export type ListOptionAxios = {
    replacements: OptionParams;
  };
  export type SourceOptionAxios = {
    params: SourceParams;
  };
  export type ListNoPageAxios = {
    params: {
      isPage: number;
    };
  };
  export interface ListQuery {
    orgId: number;
    name: string;
    sourceId: string;
  }
  export type ListResponse = ResponseDataForPage<Instance>;

  // 创建要素
  export interface CreateData {
    orgId: number; //系统主键id
    sourceId: string; //数据源主键id
    name: string; // 要素名称
    elementType: string; //要素类型
    propertyId: string; //要素所对应的字段属性id
    propertyPath: string; //要素所对应的字段属性全路径
    height: number; //高
    width: number; //宽
    fontSize: number; //字体大小
    remark: string; //描述
    fixedValue: string; //要素取值
    valueType: number; //要素取值类型 0：绑定数据源  1：固定值
    required: number; // 是否必填 0非 1是
  }
  export type CreateAxios = {
    data: CreateData;
  };
  export type CreateResponse = ResponseData<Instance>;

  // 查询要素详情概览

  export type DetailQueryAxios = {
    replacements: IdParams;
  };
  export type DetailResponse = ResponseData<Instance>;

  // 修改要素概览信息
  export interface UpdateData {
    id: string; //要素id
    orgId: string; //系统主键id
    sourceId: string; //数据源主键id
    name: string; // 要素名称
    elementType: string; //要素类型
    propertyId: string; //要素所对应的字段属性id
    propertyPath: string; //要素所对应的字段属性全路径
    height: number; //高
    width: number; //宽
    fontSize: number | null; //字体大小
    remark: string; //描述
    fixedValue: string; //要素取值
    valueType: number; //要素取值类型 0：绑定数据源  1：固定值
    parentIds: Array;
    required: number; // 0 非必填 1 必填
  }
  export type UpdateAxios = {
    data: UpdateData;
    replacements: IdParams;
  };
  export type UpdateResponse = ResponseData<Instance>;

  // 删除要素
  export interface DeleteData {
    checkFlag: boolean;
  }
  export type DeleteAxios = {
    params: DeleteData;
    replacements: IdParams;
  };
  export type DeleteResponse = ResponseData<Instance>;

  // 级联
  export interface SystemSourcePropertyData {
    level: number;
    id: number;
    sourceId: number;
    parentId: number;
    hasChild: number;
  }
  export type SystemSourcePropertyAxios = {
    params: SystemSourcePropertyData;
  };
  export type SystemSourcePropertyResponse = ResponseData<Instance>;

  //上传图片
  export type UploadImageAxios = {
    data: { file: Blob };
  };
  export type UploadImageResponse = ResponseData<Instance>;
}
