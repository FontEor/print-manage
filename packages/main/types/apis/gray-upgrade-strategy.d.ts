import {ResponseData, ResponseDataForPage} from "@/types/response";
import {RequestForPage} from "@/types/request";

export namespace GrayUpgradeStrategy {

  export interface Instance {
    id: number;
    name: string;
    version: string;
    upgradeType: 1 | 2 | 3 | 4;
    upgradeValue: string | number;
    createTime: string;
    createUser: string;
    status: 0 | 1;
  }

  export type ListAxios = RequestForPage;

  export type ListResponse = ResponseDataForPage<Instance>;

  export interface CreateData {
    name: string;
    version: string;
    upgradeType: 1 | 2 | 3 | 4;
    upgradeValue: string | number;
    percentage: number | undefined; // 前端字段
    appKey: string; // 前端字段
    pin: string; // 前端字段
    machineId: string; // 前端字段
  }

  export type CreateAxios = {
    data: CreateData;
  }

  export type CreateResponse = ResponseData<null>;

  export type DetailAxios = {
    replacements: {
      id: number;
    }
  }

  export type DetailResponse = ResponseData<Instance>;

  export type CloseAxios = {
    replacements: {
      id: number;
    }
  }

  export type CloseResponse = ResponseData<null>;

}
