import { ResponseData, ResponsePageData } from '@/types/response';

export namespace BusinessTemplateConfig {
  export type TraderCodeTypes = 1 | 2 | 3;
  export interface Instance {
    id: number;
    traderCodeType: TraderCodeTypes;
    traderCodeName?: string; // 前端添加字段
    traderCode: string;
    traderName: string;
    templateFirstCategoryName: string;
    templateSecondCategoryName: string;
    templateCode: string;
    templateName: string;
    updateUser: string;
    updateTime: string;
  }

  export interface QueryData {
    traderCodeType?: TraderCodeTypes;
    traderCodeOrName?: string;
    categories: string[];
    codeOrName: string;
  }

  export interface EndQueryData {
    traderCodeType?: TraderCodeTypes;
    traderCodeOrName?: string;
    templateFirstCategoryCode: string;
    templateSecondCategoryCode: string;
    codeOrName: string;
  }

  export type ListAxios = {
    params: QueryData;
    replacements: {
      orgId: number;
    };
  };

  export type ListResponse = ResponsePageData<Instance>;

  export interface CreateData {
    traderCodeType: TraderCodeTypes;
    traderCode: string;
    traderName: string;
    traderJdAccount: string;
    templateCode: string;
    templateName: string;
    templateId: number | undefined;
    categories: string[];
    remark: string;
  }

  export interface EndCreateData extends Omit<CreateData, categories> {
    templateFirstCategoryCode: string;
    templateSecondCategoryCode: string;
  }

  export type CreateAxios = {
    data: CreateData;
    replacements: {
      orgId: number;
    };
  };

  export type CreateResponse = ResponseData<null>;

  export interface UpdateData {
    traderJdAccount: string;
    remark: string;
  }

  export type UpdateAxios = {
    replacements: {
      id: number;
      orgId: number;
    };
    data: UpdateData;
  };

  export type UpdateResponse = ResponseData<null>;

  export type DeleteAxios = {
    replacements: {
      id: number;
      orgId: number;
    };
  };

  export type DeleteResponse = ResponseData<null>;

  export interface BusinessNameByCodeQuery {
    traderCode: string;
    traderCodeType: TraderCodeTypes;
  }

  export type DetailAxios = {
    replacements: {
      id: number;
      orgId: number;
    };
  };

  export interface DetailInstance {
    id: number;
    traderCodeType: TraderCodeTypes;
    traderCode: string;
    traderName: string;
    traderJdAccount: string;
    templateCode: string;
    templateName: string;
    templateFirstCategoryName: string;
    templateSecondCategoryName: string;
    remark: string;
  }

  export type DetailResponse = ResponseData<DetailInstance>;

  export type BusinessNameByCodeAxios = {
    params: BusinessNameByCodeQuery;
    replacements: {
      orgId: number;
    };
  };

  export type BusinessNameByCodeResponse = ResponseData<string | null>;

  export interface GetTemplateByCodeData {
    orgId: number;
    templateCode: string;
    templateFirstCategoryCode: string;
    templateSecondCategoryCode: string;
  }
  export interface GetTemplateByCodeAxios {
    params: GetTemplateByCodeData;
    replacements: {
      orgId: number;
    };
  }

  export type GetTemplateByCodeResponse = ResponseData<{
    name: string;
    id: number;
  }>;
}
