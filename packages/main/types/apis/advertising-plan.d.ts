import { ResponseData, ResponseDataForPage } from '@/types/response';
import { RequestForPage } from '@/types/request/requestV1';

export namespace AdvertisingPlan {
  export interface Instance {
    idx: number;
    id: number;
    title: string;
    image: string;
    qrcode: string;
    timeRange: string;
    startTime: number;
    endTime: number;
    updateUser: string;
    updateTime: number;
    createUser: string;
    createTime: number;
  }

  export interface WebInstance extends Instance {
    startTime: string;
    endTime: string;
    createTime: string;
    updateTime: string;
  }

  export interface ListQuery extends RequestForPage {
    title: string;
    timeRange?: string[];
  }

  export type ListQueryAxios = {
    params: ListQuery;
  };

  export type ListResponse = ResponseDataForPage<WebInstance>;

  export type CreateData = {
    title: string;
    timeRange: string[];
    channelRange: string[];
    deliveryRange: string[];
    cityRange: [string, string][];
    image: string;
    qrcode: string;
  };

  export type CreateAxios = {
    data: CreateData;
  };

  export type CreateResponse = ResponseData<undefined>;

  export type UpdateData = {
    id: number;
  } & Omit<CreateData, 'title'>;

  export type UpdateAxios = {
    data: UpdateData;
  };

  export type UpdateResponse = ResponseData<undefined>;

  export type DetailAxios = {
    replacements: {
      id: number;
    };
  };

  export type Detail = {
    id: number;
    title: string;
    startTime: number;
    endTime: number;
    channelRange: string[];
    deliveryRange: string[];
    cityRange: CityInstance[];
    image: string;
    qrcode: string;
  };

  export type DetailResponse = ResponseData<Detail>;

  export type WhiteListDetailResponse = ResponseData<string[]>;

  export type WhiteListUpdateAxios = {
    data: string[];
  };

  export type WhiteListUpdateResponse = ResponseData<undefined>;

  export interface CityInstance {
    province: string;
    city: string;
  }

  export interface CityTree {
    name: string;
    desc: string;
    children?: CityTree[];
  }

  export type CitiesResponse = ResponseData<CityTree[]>;

  export interface ChannelInstance {
    name: string;
    code: string;
  }

  export type ChannelResponse = ResponseData<ChannelInstance[]>;
}
