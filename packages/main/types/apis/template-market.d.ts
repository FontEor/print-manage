import { List } from 'lodash';
import { TemplateTag } from './template-tag';
import { Custom } from './custom';
import { RequestForPage } from '@/types/request/requestV1';
import { Standard } from '@/types/apis/standard';
export namespace TemplateMarket {
  export interface TemplateMarketQuery {
    org?: number; // 模板提供方（code或者name）
    orgId?: string; // 系统ID
    templateFirstCategoryCode?: string; // 一级分类code
    templateSecondCategoryCode?: string; // 二级分类code
    templateCode?: string; // 模板编码
    templateName?: string; // 模板名称
    tags?: Array<TemplateTag.Instance>; // 标签名称列表
    height?: number; // 高
    width?: number; // 宽
    from?: number; // 第几页
    size?: number; // 单页展示数量
  }
  export type TemplateMarketQueryAxios = {
    data: {
      org: number; // 模板提供方（code或者name）
      orgId: number; // 系统ID
      templateFirstCategoryCodeList: string[]; // 一级分类code
      templateSecondCategoryCodeList: string[]; // 二级分类code
      codeOrName: string; // 模板编码
      tags: List<String>; // 标签名称列表
      height: number; // 高
      width: number; // 宽
      from: number; // 第几页
      size: number; // 单页展示数量
    };
  };
  export type TemplateMarketListResponse = {
    id: string;
    templateId: number;
    orgId: string;
    orgName: string;
    name: string;
    code: string;
    coverImage?: string;
    addTemplateFlag?: number;
    hasCustom: number;
    des?: string;
    deliveryCode: string;
    specifId: number; // 面单类型
    height: number;
    width: number;
    type: number;
    versionId?: number;
    templateFirstCategoryCode: string;
    templateSecondCategoryCode: string;
    templateFirstCategoryName: string;
    templateSecondCategoryName: string;
    tags: Array<string>;
    createUser: string;
    updateUser: string;
    createTime: string;
    updateTime: string;
  };
  // 添加模板
  export type AddToTemplateList = {
    id: string;
    orgId: string;
  };
  export type StateDetail = {
    id: number;
    orgId: number;
    verId: number;
    code: string;
    sourceId?: number;
    templateType?: string;
  };
  export interface StateDetailCustom extends StateDetail {
    isAllCustom?: boolean; // 与绘制自定义区 区分 true表示绘制整个模板
    areaId: number;
    parentTemplateId: number;
    parentTemplateCode: string;
  }

  export interface ListInstance extends Custom.Instance {
    parentTemplateCode: string;
    extend1: string;
    extend2: string;
    extend3: string;
    extend4: string;
    extend5: string;
    tags: TemplateTag.Instance[];
    tagIdList: number[];
  }
  export interface SearchData extends RequestForPage {
    org: string;
    tags: number[];
    orgId: string;
    height?: number;
    width?: number;
    codeOrName: string;
    categories: string[][];
  }

  export interface CreateTemplateFromMarket extends Standard.CreateUserTemplateInfo {
    category: string[];
    height: '';
    width: '';
  }
}
