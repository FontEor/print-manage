import { ResponseData, ResponseDataGeneral } from '@/types/response';

export namespace TemplateTag {
  export interface Instance {
    id: number;
    orgId: number;
    name: string;
  }
  // 列表
  export type ListAxios = {
    replacements: {
      orgId: string;
    };
  };
  export type ListResponse = ResponseData<Instance[]>;
  export type ListResponseOfOther = ResponseData<String[]>;
  // 创建
  export type CreateAxios = {
    replacements: {
      orgId: string;
    };
    data: {
      tagName: string;
    };
  };
  export type CreateResponse = ResponseData<Instance>;
  // 更新
  export type UpdateAxios = {
    replacements: {
      orgId: string;
      id: number;
    };
    data: {
      tagName: string;
    };
  };
  export type UpdateResponse = ResponseDataGeneral;
  // 删除
  export type DeleteAxios = {
    replacements: {
      orgId: number;
      id: number;
    };
  };
  export type DeleteResponse = ResponseDataGeneral;

  export type StyleType = 'success' | 'info' | 'warning' | 'danger' | '';
  export interface TypeInstance extends Instance {
    type: StyleType;
  }

  export interface TagRect {
    label: string;
    width: number;
    height: number;
    line: number;
  }
}
