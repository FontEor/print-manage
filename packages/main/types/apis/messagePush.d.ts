import { RequestForPage } from '../request/requestV1';
import { ResponseDataForPage } from '../response';

export namespace MessagePush {
  // 推送类型
  export enum PushTypeEnum {
    '按版本号推送' = 1,
    '按AppKey推送' = 2,
    '按PIN推送' = 3,
    '按机器ID推送' = 4,
    '全网推送' = 5,
  }
  export enum ActionEnum {
    '立即展示' = 1,
    '定时展示' = 2,
  }
  export enum Status {
    '待审核' = 1,
    '已推送' = 2,
    '已驳回' = 3,
    '已关闭' = 4,
  }
  // 数据实例
  export interface Instance extends CreateData {
    id: number;
    touchRate: number; // 触达率
    clickRate: number; // 点击率
    status: Status; // 状态码状态
    examiner: string; // 审核人
    examineTime: string; // 审核时间
    createTime: string; // 创建时间
  }

  export interface CreateData {
    name: string; // 名称
    content: string; // 内容
    link: string; // 跳转链接
    type: PushTypeEnum; // 推送类型
    action: ActionEnum; // 展示时机
    isRepeat: 1 | 2; // 是否重复
    time?: string; // 时间字符串 23:50:50
    duration: number; // 持续时长 秒级
    /**
     * 识别码
     * 推送类型为 全网推送 时值为 ""
     */
    codes: string;
  }

  // 查询
  export interface ListQuery extends RequestForPage {
    status?: Status;
  }

  export type ListAxios = {
    params: ListQuery;
  };

  export type ListReposne = ResponseDataForPage<Instance>;

  // 创建接口
  export type CreateAxios = {
    data: CreateData;
  };
  export type CreateResponse = ResponseData<Instance>;

  // 修改接口
  export type ChangeAxios = {
    replacements: {
      id: number;
    };
    data: CreateData;
  };
  export type ChangeResponse = ResponseData<Instance>;

  // 详情
  export type DetailAxios = {
    replacements: {
      id: number;
    };
  };
  export type DetailResponse = ResponseData<Instance>;

  // 审批
  export type ExamineAxios = {
    data: {
      id: number;
      status: 2 | 3 | 4;
    };
  };

  export type ExamineResponse = ResponseData<null>;
}
