import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace Custom {
  export interface Instance {
    code: string; // 编码
    coverImage: string; // 自定义区所属标准模板-预览图路径
    createTime: string; // 创建时间
    createUser: string; // 创建人
    deliveryCode: string; // 承运商编码
    des: string; // 描述
    height: number; // 高(单位 mm)
    id: number;
    identity: number; // 身份标识（保存时）
    isDelete: number; // 是否删除: 0：未删除 1：已删除
    isPage: number; // 是否分页
    name: string; // 名称
    nid: number; // 原ID（对外接口）
    orgId: number; // 系统id
    path: string; // 自定义区所属标准模板-path
    sourceId: number; // 数据源ID
    specifId: number; // 面单类型ID
    status: number; // 状态 0 未发布 1 已发布
    tempId: number; // 标准模版ID
    ts: string; // 时间戳
    updateTime: string; // 修改时间
    updateUser: string; // 修改人
    version: number; // 乐观锁版本
    width: number; // 宽(单位 mm)
    currentPushVer: number; // 当前发布版本
    currentVerId: number; // 当前发布版本ID
    customCoverImage: string; // 前端发布版本背景图
    tempName: string; // 标准区模板名称

    currentDefaultVer: number; // 当前默认版本号
    currentDefaultId: number; // 当前默认版本ID
    defaultCoverImage: string; // 默认版本封面图
    tempUrl: string; // 模板URL
  }

  export interface ListQuery extends RequestForPage {
    tempId: string;
    deliveryCode: string;
    orgId: string;
    tempNameOrCode: string;
  }

  export type ListQueryAxios = {
    params: ListQuery;
  };

  export type ListResponse = ResponseDataForPage<Instance>;

  // 详情相关
  export interface DetailQuery {
    temId: string;
  }

  export type DetailQueryAxios = {
    replacements: DetailQuery;
  };

  export type DetailResponse = ResponseData<Instance>;

  export type ChangeDataAxios = {
    params: {
      name: string;
      sourceId: string;
      isPage: number;
    };
    replacements: {
      id: number;
      temId: number;
    };
  };
  export type ChangeResponse = ResponseData<null>;

  // 删除
  export type DeleteAxios = {
    replacements: DetailQuery;
  };
  export type DeleteResponse = ResponseData<{ hasPublishTemp: number }>;
}
