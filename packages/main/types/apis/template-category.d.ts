import { ResponseData } from '@/types/response';

export namespace TemplateCategory {
  export interface Instance {
    id: number;
    code: string;
    name: string;
    children?: Instance[];
  }
  export interface ListInstance {
    parent: string;
    category: Omit<Instance, 'children'>;
    children: Instance[];
  }
  export type ListOriginalResponse = ResponseData<ListInstance[]>;
  export type ListResponse = ResponseData<Instance[]>;
}
