import { ResponseDataForPage, ResponseData } from '../response';

export namespace Version {
  export interface Instance {
    coverImage: string;
    createTime: string;
    createUser: string;
    force: number | null;
    id: number;
    isDelete: number;
    isPage: number;
    orgId: number;
    path: string;
    pluginPath: string;
    remark: string;
    simpDataPath: string;
    simpleData: null;
    sourceId: number;
    sourceName: string;
    status: 0 | 1 | 2;
    tempContent: null;
    tempId: number;
    tempName: string;
    tempVersion: number;
    ts: string;
    type: number;
    updateTime: string;
    updateUser: string;
    version: number;
    customTempId: number;
    sourceId: number;
    code: string;
    defaultVersion: 0 | 1;
    // 新增字段
    tempCode: string;
  }
  export type SetDefaultAxios = {
    replacements: {
      id: string;
      temId: number;
      verId: number;
    };
    params: {
      tempType: number; // 1 标准模板 2 自定义区模板
    };
  };
  export type SetDefaultResponse = ResponseData<Instance>;
}
