export namespace VersionManage {
  interface UpdateRecordInfo {
    regenerator: string;
    updateTime: string;
  }
  export interface Instance {
    id: number;
    templateId: number;
    templateCode: string;
    sourceId: number;
    orgId: number;

    version: number;
    isDefault: boolean;
    time: string;
    imgCover: string;
    reason: string;
    published: boolean;
    updateRecordList: Array<UpdateRecordInfo>;
    parentTemplateId?: number | string;
    parentTemplateCode?: string;
    type: number;
    status: 0 | 1 | 2;
  }
}
