// /orgs/tempOrgs
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

// 插件版本管理
export namespace PluginVersion {
  // 基本实例结构
  export interface Instance {
    code: string; // 版本号
    createTime: number; // 创建时间（）
    describe: string; // 版本说明
    downloadLink: string; // 下载地址
    id: number;
    lastShelfTime; // 最后上架时间
    push: boolean; //	推送状态	boolean
    remark: string; // 备注
    status: 1 | 2 | 3; //	状态
    fingerprint: string; // 指纹
  }

  // 查询列表
  export type ListQueryAxios = {
    params: RequestForPage;
  };

  export type ListResponse = ResponseDataForPage<Instance>;

  // 创建接口
  export interface CreateData {
    id?: number;
    code: string; // 版本号
    describe: string; //	版本说明
    downloadLink: string; // 下载地址
    remark: string; // 备注
    fingerprint: string; // 指纹
  }
  export type CreateAxios = {
    data: CreateData;
  };
  export type CreateResponse = ResponseData<undefined>;

  // 推送接口
  export type PushAxios = {
    replacements: {
      id: number; // 操作ID
    };
  };
  export type PushResponse = ResponseData<Instance>;

  export interface UpDownData {
    id: number; // 操作ID
    shelf: boolean; // 是否上架
  }
  // 上下架
  export type UpDownAxios = {
    data: UpDownData;
  };
  export type UpDownResponse = ResponseData<Instance>;

  // 当前版本
  export type GetCurrentVersion = {};

  export type GetCurrentVersionAxios = {};

  export type GetCurrentVersionResponse = ResponseData<Instance>;

  // 获取详情 /plugin/version/version/{id}
  export type DetailAxios = {
    replacements: {
      id: number;
    };
  };
  export type DetailResponse = ResponseData<Instance>;

  // 删除 ​/plugin​/version​/{id}
  export type DeleteAxios = {
    replacements: {
      id: number;
    };
  };
  export type DeleteResponse = ResponseData<null>;

  // 编辑 ​/plugin​/version​/edit​/{id}
  export type UpdateAxios = {
    replacements: {
      id: number;
    };
    data: {
      describe: string;
      downloadLink: string;
      fingerprint: string;
      remark: string;
    };
  };
  export type UpdateResponse = ResponseData<null>;
}

export namespace PluginInstall {
  // 基本实例结构
  export interface Instance {
    cpuName: string; //	CPU型号
    firstInstallTime: string; // 首次安装时间
    lastHeartbeatTime: string; //	上次心跳时间
    macAddress: string; //	MAC地址
    machineId: string; //	机器id
    machineName: string; //	机器名称
    pluginUpgradeTime: string; //	插件更新时间
    pluginVersionCode: string; //	插件版本号
    printLocation: string; //	打印地点
    status: string; //	运行状态
  }
  /**
   * 前端UI的数据格式
   */
  export interface ListQuery extends RequestForPage {
    installTimes?: [Date?, Date?]; //	首次安装时间
    updateTimes?: [Date?, Date?]; //	插件更新时间
    pluginVersionCode: string; //	插件版本号
    status?: 1 | 2 | 3; //	运行状态
    machineId?: string; // 装机ID
  }

  /**
   * 后台真正需要的数据格式
   * 在请求局部拦截器中处理
   */
  export interface ListQueryBackEnd extends RequestForPage {
    firstInstallTimeEnd?: number; //	首次安装时间止
    firstInstallTimeStart?: number; //	首次安装时间起
    pluginUpgradeTimeEnd?: number; //	插件更新时间止
    pluginUpgradeTimeStart?: number; //	插件更新时间起
    pluginVersionCode: string; //	插件版本号
    status?: 1 | 2 | 3; //	运行状态
  }

  // 查询列表
  export type ListQueryAxios = {
    data: ListQuery;
  };

  export type ListResponse = ResponseDataForPage<Instance>;
}

// 插件强制升级
export namespace PluginForceUpdate {
  // 基本实例结构
  export interface Instance {
    id: number;
    pin: string;
    status: string;
    pluginVersion: string;
    completedTime: string;
    percentage: number;
    createdTime: string;
    createdBy: string;
    updatedTime: string;
    updatedBy: string;
  }
  // 查询列表
  export interface ListQuery extends RequestForPage {
    status?: string;
    pin?: string;
  }
  export type ListQueryAxios = {
    params: ListQuery;
  };
  export type ListQueryResponse = ResponseDataForPage<Instance>;

  // 导入pins
  // pins数据直接放入data 多个数据由,分隔
  export interface ImportPinsAxios {
    data: {
      pins: string;
    };
  }
  export type ImportPinsResponse = ResponseData<Instance>;

  // 暂停强制升级
  export type PauseUpgradeAxios = {
    data: {
      pins: string[];
    };
  };
  export type PauseUpgradeResponse = ResponseData<Instance>;

  // 恢复强制升级
  export type ResumeUpgradeAxios = {
    data: {
      pins: string[];
    };
  };
  export type ResumeUpgradeResponse = ResponseData<Instance>;

  // 设置成功率百分比
  export type SetSuccessPercentageAxios = {
    data: {
      pins: string[];
      percentage: number;
    };
  };
  export type SetSuccessPercentageResponse = ResponseData<Instance>;

  // 开始强制升级
  export type StartForceUpgradeAxios = {
    data: {
      pins: string[];
    };
  };
  export type StartForceUpgradeResponse = ResponseData<Instance>;
}
