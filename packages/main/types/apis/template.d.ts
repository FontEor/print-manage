import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';
import { openTemplateData } from './openTemplateData';

export namespace TemplateImages {
  export interface Instance extends openTemplateData.Instance {
    orgId?: number;
  }

  export interface ListQuery extends RequestForPage {
    sourceId: string; // 数据源ID
    codeOrName: string; // 名称或编码
    deliveryCode: string; // 承运商编码
    hasCustom?: string; // 是否包含自定义区
    id?: number; // 系统ID
    isIssUed?: number; // 是否发布
    isPage: number; // 是否分页
    needImage?: number; // 是否需要查询coverImage
    specifId?: number;
  }

  export type ListQueryAxios = {
    params: ListQuery;
  };

  export type ListResponse = openTemplateData.ListResponse;
}

export namespace TemplateReplace {
  export interface Instance {
    id: number;
    idDelete: number;
    newUrl: string;
    oldUrl: string;
    templateCode: string;
    templateName: string;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
  }

  export interface ListQuery extends RequestForPage {
    key: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
  };
  export type ListResponse = ResponseDataForPage<Instance>;

  // 查询列表
  export interface StandardListInstance {
    code: string;
    name: string;
    url: string;
  }

  export type StandardListAxios = {
    params: {
      key: string;
    };
  };

  export type StandardListResponse = ResponseDataForPage<StandardListInstance>;

  // 创建相关
  export type CreateData = {
    newUrl: string;
    oldUrl: string;
    templateCode: string;
    templateName: string;
  };

  export type CreateAxios = {
    data: CreateData;
  };

  export type CreateResponse = ResponseData<SearchInstance>;

  // 修改相关
  export type ChangeData = {
    id: number;
    newUrl: string;
    oldUrl: string;
    templateCode: string;
    templateName: string;
  };
  export type ChangeAxios = {
    data: ChangeData;
  };
  export type ChangeResponse = ResponseData<SearchInstance>;

  // 删除
  export type DeleteAxios = {
    params: {
      id: number;
    };
  };
  export type DeleteResponse = ResponseData<SearchInstance>;
}
