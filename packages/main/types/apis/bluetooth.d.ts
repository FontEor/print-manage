import { RequestForPage } from '../request/requestV1';
import { ResponseData, ResponseDataForPage, ResponseDataList } from '../response';

export namespace Bluetooth {
  export interface PrintType {
    code: string;
    dataFormat: number; // 数据格式
    fileFormat: number; // 文件格式
    name: string; // 名称
    category: string; // 指令集
    categoryName: string; // 指令集名称
  }
  // 树形结构打印类型 cascader使用
  export interface Instance {
    id: number;
    tradeName: string; // 厂商
    model: string; // 型号
    regep: string; // 蓝牙名称
    printType: string[]; // 支持的打印方式
    printTypeDesc: string[]; // 支持的打印方式 回显字段
    recomandPrintType: string; // 推荐的打印方式
    recomandPrintTypeDesc: string; // 推荐的打印方式 回显字段
    channelStart: string; // 信道开始
    channelEnd: string; // 信道结束
    maxByte: number; // 最大字节
    updateUser: string;
    updateTime: string;
  }
  // 列表
  export interface ListQuery extends RequestForPage {
    tradeName: string;
    model: string;
  }
  // 查询后端真是格式
  export interface ListEndQuery extends ListQuery {
    pageNum: number;
    pageCount: number;
  }
  export interface ListAxios {
    params: ListQuery;
  }
  export type ListResponse = ResponseDataForPage<Instance>;

  // 创建
  export interface CreateData {
    tradeName: string;
    model: string;
    regep: string;
    printType: string[];
    recomandPrintType: string;
    channelStart: string; // 信道开始
    channelEnd: string; // 信道结束
    maxByte?: number; // 最大字节
  }

  export type CreateAxios = {
    data: CreateData;
  };

  export type CreateResponse = ResponseData<null>;
  // 编辑
  export type UpdateData = CreateData;
  export type UpdateAxios = {
    replacements: {
      id: number;
    };
    data: CreateData;
  };
  export type UpdateResponse = ResponseData<null>;
  // 详情
  export type DetailAxios = {
    replacements: {
      id: number;
    };
  };
  export type DetailResponse = ResponseData<Instance>;
  // 删除
  export type DeleteAxios = {
    replacements: {
      id: number;
    };
  };
  export type DeleteResponse = ResponseData<null>;

  // 获取打印方式
  export type PrintTypeAxios = {};
  export type PrintTypeResponse = ResponseDataList<PrintType[]>;
}
