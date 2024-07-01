import { AxiosRequestConfig } from 'axios';
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';

export namespace Logs {
  export interface LogsDataJson {
    cpCode: string;
    standardTemplateId: string;
    pcMac: string; // 网卡地址
    telegramContent: string; // 完整请求报文
    customerCode: string;
    totalPrintCount: number; // 请求面单数量
    customizeTemplateName: string;
    printTimeStamp: number; // 打印完成时间
    clientVersion: string; // 组件版本
    receiveTelegramTimeStamp: number;
    uuid: string;
    customTempUrl: string;
    duration: number;
    spanId: number;
    clientType: string; // 组件类型
    osVersion: string; // 操作系统版本号
    pin: string;
    printMessage: string; // 反馈结果信息
    telegramType: string; // 报文类型 orderType
    appKey: string;
    id: string;
    tempUrl: string;
    logCollectTimestamp: number;
    key: string; // 报文标识ID
    isSuccess: string;
    durationProcessData: number;
    printStatus: string; // 处理状态
    pcName: string;
    index: string;
    durationRender: number; // 数据处理时长
    telegramVersion: string; // 打印报文版本
    printData: string;
    userName: string; // 操作系统用户名
    customizeTemplateId: string;
    pcIP: string;
    sId: string;
    size: number;
    hardwareId: string; // CPU编号
    version3: boolean;
    packageCode: string;
    wayBillCode: string;
    printType?: 'server' | 'client';
    standardTemplateName: string;
    customData: string; // 自定义区数据
    sys: string; // 系统
  }

  export interface PrintMessageResult {
    dataFormat: number;
    fileFormat: number;
    outputType: number;
    url: string;
  }
  export interface PrintMessage {
    code: number;
    msg: string;
    result: PrintMessageResult[];
    code: number;
  }
  export interface Instance {
    pin: string;
    customizeTemplateName: string; // 自定义模板名称
    data: string; // 日志数据体
    machineId: string; // 机器id
    pluginVersionCode: string; // 插件版本号
    printTime: string; // 打印时间
    serviceMerchant: string; // 物流服务商
    standardTemplateName: string; // 标准模板名称
    taskId: string; // 任务id
    timeConsuming: number; // 耗时
    waybillNumber: string; // 运单号
    /** 其他字段 */
    printType: 'server' | 'client'; // 谁打印的
    isSuccess: 'true' | 'false'; // 是否成功
    printMessage: string; // 打印消息
  }
  export interface ListQuery extends RequestForPage {
    customizeTemplateName: string; // 自定义模板名称
    pin: string;
    pluginVersionCode: string; // 插件版本号
    serviceMerchant: string; // 物流服务商
    standardTemplateName: string; // 标准模板名称
    taskId: string; // 任务id
    timeConsumingEnd?: number; // 耗时上限
    timeConsumingStart?: number; // 耗时下限
    waybillNumber: string; // 运单号
    printTimes?: [Date?, Date?]; //	首次安装时间
    printStatus: string; // 错误码
    machineId?: string; // 机器ID
    tempUrlHostType?: number;
    templatePlatform: ''; // 是否新面单
  }
  // 列表接口
  export interface ListQueryBack extends RequestForPage {
    customizeTemplateName: string; // 自定义模板名称
    pin: string;
    pluginVersionCode: string; // 插件版本号
    printTimeStart: number; // 打印时间起 秒级时间戳
    printTimeEnd: number; // 打印时间止 秒级时间戳
    serviceMerchant: string; // 物流服务商
    standardTemplateName: string; // 标准模板名称
    taskId: string; // 任务id
    timeConsumingEnd: number; // 耗时上限
    timeConsumingStart: number; // 耗时下限
    waybillNumber: string; // 运单号
  }
  export type ListQueryAxios = {
    data: ListQuery;
  };
  export type ListResponse = ResponseDataForPage<Instance>;

  // 预览相关
  export interface PreviewData {
    simpData: object; // 模板数据
    templateContent?: string; // 标准模板内容
    customTempContent: string; // 自定义模板内容
    tempUrl: string;
    customTempUrl: string; // 自定义模板地址
    clientType: string; // 打印端 server 云端 client 客户
    clientVersion: string; // 插件版本
  }

  export interface PreviewDataForm extends FormData {
    append(name: 'simpData', value: string, fileName?: string): void;
    append(name: 'templateContent', value: string, fileName?: string): void;
    append(name: 'customTempContent', value: string, fileName?: string): void;
    append(name: 'tempUrl', value: string, fileName?: string): void;
    append(name: 'customTempUrl', value: string, fileName?: string): void;
    append(name: 'clientType', value: string, fileName?: string): void;
  }

  export type PreviewDataAxios = {
    data: PreviewDataForm;
  };

  export type PreviewResponse = ResponseData<string>;

  // download
  export type DownloadProxyAxios = {
    data: {
      link: string;
    };
  };

  export type DownloadProxyResponse = ResponseData<string>;
}
