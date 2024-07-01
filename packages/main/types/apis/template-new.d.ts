import { openTemplateData } from '@/types/apis/openTemplateData';
import { RequestForPage } from '@/types/request/requestV1';
import { ResponseData, ResponseDataForPage } from '@/types/response';
import { TemplateTag } from '@/types/apis/template-tag';

export namespace TemplateNew {
  export enum TypeStatus {
    0 = '标准模板',
    1 = '全定义模板',
    2 = '自定区模板',
  }
  export type TypeStatusKeys = keyof typeof TypeStatus;
  export enum ShareStatus {
    true = '已分享',
    false = '未分享',
  }
  export enum PublishStatus {
    0 = '未发布',
    1 = '已发布',
  }
  // 列表搜索相关
  export interface SearchData extends RequestForPage {
    tags: number[];
    orgId: number | undefined;
    height?: number;
    width?: number;
    codeOrName: string;
    categories: string[][];
  }
  export interface SizeInputState {
    height?: number;
    width?: number;
  }

  export type ListWebAxios = {
    params: Partial<Omit<SearchData, 'orgId'>> & Pick<SearchData, 'orgId'>;
  };

  export type EndSearchData = {
    orgId: number | undefined;
    templateFirstCategoryCodeList: string[];
    templateSecondCategoryCodeList: string[];
    templateCode?: string;
    templateName?: string;
    tags: Array<number>;
    height?: number;
    width?: number;
  } & RequestForPage;
  export type ListResponse = ResponseDataForPage<Instance>;
  // 列表实例
  export interface ListInstance {
    id: number;
    orgId: number | undefined;
    name: string;
    code: string;
    coverImage: string;
    deliveryCode: string;
    hasCustom: 0 | 1;
    width: number;
    height: number;
    des: string;
    parentCode?: string;
    parentName?: string;
    category?: string;
    templateFirstCategoryCode: string;
    templateSecondCategoryCode: string;
    templateFirstCategoryName: string;
    templateSecondCategoryName: string;
    type: keyof typeof TypeStatus;
    shared: keyof typeof ShareStatus;
    tags: Omit<TemplateTag.Instance, 'orgId'>[];
    updateUser: string;
    updateTime: string;
    tempUrl: string;
    extend1: string;
    extend2: string;
    extend3: string;
    extend4: string;
    extend5: string;
    status: keyof typeof PublishStatus;
    sourceName: string;
    sourceId: number;
    createTime: string;
    createUser: string;
    defaultCoverImage: string;
    currentDefaultVer: number;
    verId: number;
    publicNetwork: 0 | 1; // 0不开放 1开放
  }
  // 需要的详情实例数据
  export interface Instance extends openTemplateData.Instance {
    extend1: null;
    extend2: null;
    extend3: null;
    extend4: null;
    extend5: null;
    extend6: null;
    extend7: null;
    extend8: null;
    type: keyof typeof TypeStatus;
    id: number;
    shared: boolean;
  }
  // 发布请求
  export type PublishTemplateAxios = {
    replacements: {
      orgId: number | undefined;
      code: string;
    };
    params: {
      status: keyof typeof PublishStatus;
    };
  };
  // 创建模板
  export interface CreateData extends openTemplateData.CreateData {
    templateFirstCategoryCode: string;
    templateSecondCategoryCode: string;
    tagIdList: number[];
  }
  export interface UpdateData {
    code: string;
    name: string;
    hasCustom: 0 | 1 | null;
    width: string;
    height: string;
    des: string;
    orgId: number | undefined;
    tagIdList: number[];
    firstCategoryCode: string;
    secondCategoryCode: string;
    sourceId: number | string;
    extend1?: string;
    extend2?: string;
    extend3?: string;
    extend4?: string;
    extend5?: string;
    publicNetwork?: 0 | 1;
  }
  export interface IdParams {
    id: string;
  }
  export type CreateFrom = {
    code: string; // 模板编码
    name: string; // 模板名称
    sourceId: string | number; // 数据源
    hasCustom: 0 | 1 | null; // 是否含自定义区
    width: string;
    height: string;
    des: string; // 使用说明
    tagIds: Array<number>; // 标签
    orgId: number | undefined; // 机构id
    category: Array<string>; // 模版分类
  };

  export interface EditForm extends CreateFrom {
    publicNetwork: 0 | 1; // 0不开放 1开放
    extend1?: string;
    extend2?: string;
    extend3?: string;
    extend4?: string;
    extend5?: string;
  }
  export type CreateAxios = {
    data: CreateData;
    replacements: IdParams;
  };

  export type CreateResponse = ResponseData<ListInstance>;

  export type UpdateAxios = {
    data: UpdateData;
    replacements: {
      orgId: number | undefined;
      code: string;
    };
  };

  export type UpdateResponse = ResponseData<null>;

  export type DetailAxios = {
    replacements: {
      orgId: number | undefined;
      code: string;
    };
  };

  export type DetailResponse = ResponseData<ListInstance>;

  export interface ShareData {
    id: number;
    type: keyof typeof TypeStatus;
    orgId: number | undefined;
  }

  export type ShareAxios = {
    params: ShareData;
  };
}
export namespace AdjustForm {
  export interface IContentChild {
    dom: HTMLDivElement;
    line: number;
  }
}
