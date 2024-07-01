import type { SystemData } from '@/types/apis/systemData';
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '@/types/request/requestV1';

export namespace SystemAdministration {
  type OmitProps = 'parentId' | 'isOpen';
  export type Instance = Omit<SystemData.CreateData, OmitProps>;

  export interface ListQuery extends RequestForPage {
    codeOrName: string;
    owner: string;
  }
  export interface SystemList {
    code: string;
    name: string;
    owner: string;
    ownerDep: string;
    updateUser: string;
    updateTime: string;
  }

  export type ListResponse = ResponseDataForPage<SystemList>;

  export type UpdateAxios = {
    data: Instance;
    replacements: SystemData.DetailQuery;
  };
  export type CreateAxios = {
    data: Instance;
  };
  export type DetailResponse = ResponseData<Instance>;
}
