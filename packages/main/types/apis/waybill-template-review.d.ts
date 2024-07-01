import { RequestForPage } from '@/types/request';
import { ResponseData, ResponseDataForPage } from '@/types/response';

export namespace WaybillTemplateReview {
  enum Status {
    // 未审核
    Unreviewed = 1,
    // 已审核
    Reviewed = 2,
    // 已驳回
    Rejected = 3,
  }

  export interface Instance {
    code: string;
    name: string;
    createUser: string;
    createTime: string;
    status: Status;
    reviewer: string;
    reviewTime: string;
  }

  export interface ListQuery extends RequestForPage {
    status?: Status;
    nameOrCode: string;
    createUser: string;
  }

  export type ListAxios = {
    params: ListQuery;
  };

  export type ListResponse = ResponseDataForPage<Instance>;

  export interface Detail {
    code: string;
    name: string;
    category: string;
    size: string;
    hasCustom: 1 | 0;
    des: string;
    url: string;
    reason: string;
  }

  export type DetailAxios = {
    replacements: {
      id: string;
    };
  };

  export type DetailResponse = ResponseData<Detail>;
}
