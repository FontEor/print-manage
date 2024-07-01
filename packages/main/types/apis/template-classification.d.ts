import { RequestForPage } from '@/types/request';
import { ResponseData, ResponseDataForPage } from '@/types/response';

export namespace TemplateClassification {
  export interface Instance {
    id: number;
    code: string;
    name: string;
    readOnly: number; // 1 只读
    createUser: string;
    createTime: string;
    updateUser: string;
    updateTime: string;
  }

  export interface ListOriginalInstance {
    parent: string;
    category: Instance;
    children: Instance[];
  }

  export type ListOriginalResponse = ResponseDataForPage<ListOriginalInstance>;

  export interface ListInstance extends Instance {
    level: 1 | 2;
    children: Instance[];
  }

  export interface ListQuery extends RequestForPage {
    skey?: string;
  }

  export interface ListAxios {
    params: ListQuery;
  }

  export type ListResponse = ResponseDataForPage<ListInstance>;

  export interface CreateDataBase {
    code: string;
    name: string;
  }
  export interface CreateData extends CreateDataBase {
    type: 1 | 2;
    parentId?: number;
  }

  export interface CreateAxios {
    data: CreateData;
  }

  export type CreateResponse = ResponseData<null>;

  export interface UpdateData {
    name: string;
  }

  export type UpdateAxios = {
    replacements: {
      id: number;
    };
    data: UpdateData;
  };

  export type UpdateResponse = ResponseData<null>;

  export type DeleteAxios = {
    replacements: {
      id: number;
    };
  };

  export type DeleteResponse = ResponseData<null>;

  export type DetailAxios = {
    replacements: {
      id: number;
    };
  };

  export type DetailResponse = ResponseData<Instance>;
}
