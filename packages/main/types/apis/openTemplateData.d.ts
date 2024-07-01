import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';
import { Version } from './version.d';

export namespace openTemplateData {
  // 基本实例结构
  export interface Instance {
    id: string;
    orgId: number; //系统id
    code: string; //模板编码
    name: string; // 模板名称
    codeOrName: string;
    specifId: number; // 面单类型
    deliveryCode: string; //承运商编码
    createUser: string;
    createTime: string;
    updateTime: string; //更新时间
    updateUser: string; //更新人ERP
    height: number; //高
    width: number; //宽
    hasCustom: number;
    version: number;
    currentPushVer: number; //当前版本
    currentVerId: number | null; //当前版本ID
    coverImage: string;

    // 5月新增字段
    des: string; // 描述
    isPage: number;
    isDelete: number; // 是否删除 0：未删除 1：已删除
    nid: number; // 对外ID
    pin: string;
    status: number; // 状态 0 未发布 1 已发布
    ts: number; // 时间戳

    // 9月新增字段
    currentDefaultVer: number; // 当前默认版本号
    currentDefaultId: number; // 当前默认版本ID
    defaultCoverImage: string; // 默认版本封面图
    tempUrl: string; // 模板URL

    sourceId: string;
    sourceName: string;
    templateCode: string;
  }
  export interface IdParams {
    id: string;
  }
  // 查询列表
  export interface ListQuery extends RequestForPage {
    id: string;
    codeOrName: string;
    sourceId: string;
    specifId: string;
    deliveryCode: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
  };
  export type ListNoPageAxios = {
    params: {
      isPage: number;
    };
  };
  export interface ListQuery {
    codeOrName: string;
    sourceId: string;
    specifId: number;
    deliveryCode: string;
  }
  export type ListResponse = ResponseDataForPage<Instance>;

  // 查询面单类型
  export interface TempSpecifsListData {
    isPage: number;
    name: number;
  }
  export type TempSpecifsListAxios = {
    params: TempSpecifsListData;
    replacements: IdParams;
  };
  export type TempSpecifsResponse = ResponseData<Instance>;

  // 查询承运商
  export interface DeliveryListData {
    isPage: number;
  }
  export type DeliveryListAxios = {
    params: DeliveryListData;
  };
  export type DeliveryListResponse = ResponseData<Instance>;

  // 创建模板
  export interface CreateData {
    code: string; //模板编码
    name: string; // 模板名称
    sourceId: string; // 数据源ID
    specifId: number; // 面单类型
    deliveryCode: string; //承运商编码
    hasCustom: number; //自定区标识 0 无 1 有
    height: number; //高
    width: number; //宽
    des: string;
  }
  export type CreateAxios = {
    data: CreateData;
    replacements: IdParams;
  };
  export type CreateResponse = ResponseData<Instance>;

  // 查询模板详情概览
  export type DetailQuery = {
    id: number;
    temId: number;
  };
  export type DetailQueryAxios = {
    replacements: DetailQuery;
  };
  export type DetailResponse = ResponseData<Instance>;

  // 修改模板信息
  export interface UpdateData {
    code: string; //模板编码
    name: string; // 模板名称
    sourceId: string; // 数据源ID
    specifId: number; // 面单类型
    deliveryCode: string; //承运商编码
    hasCustom: number;
    height: number; //高
    width: number; //宽
    orgId: number; //系统id
    currentPushVer: number;
    coverImage: string;
  }
  export type UpdateAxios = {
    params: UpdateData;
    replacements: DetailQuery;
  };
  export type UpdateResponse = ResponseData<Instance>;

  // 删除模板
  export interface DeleteData {
    checkFlag: number;
  }
  export type DeleteAxios = {
    params: DeleteData;
    replacements: DetailQuery;
  };
  export type DeleteResponse = ResponseData<Instance>;

  // 查询版本列表
  export type VersionListAxios = {
    // 5月新增字段
    params: {
      tempType: number;
    };
    replacements: DetailQuery;
  };
  export type VersionListResponse = ResponseDataForPage<Version.Instance>;

  // 发布版本
  export type PublishQuery = {
    verId: number; //版本id
    temId: number; //模板id
  };
  export interface publishData {
    force: number; //是否强制提交 1 是 0 否
    tempType: number; // 1 标准 2自定义
    remark?: string; // 备注
    defaultFlag?: 1; // 1是表示设置默认，2或空时表示不设置默认
  }
  export type PublishVersionAxios = {
    params: publishData;
    replacements: PublishQuery;
  };
  export type PublishVersionResponse = ResponseData<Instance>;

  export interface deleteVersionData {
    checkFlag: number;
  }
  export type DeleteVersionAxios = {
    params: deleteVersionData;
    replacements: PublishQuery;
  };
  export type DeleteVersionResponse = ResponseData<Instance>;

  // 下载图片
  export type loadImgAxios = {
    params: { sourcePath: string };
  };
  export type loadImgResponse = ResponseData<Instance>;
}
