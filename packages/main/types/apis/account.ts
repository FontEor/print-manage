import { AxiosRequestConfig } from 'axios';
import { ResponseDataForPage, ResponseData } from '../response';
import { RequestForPage } from '../request/requestV1';
export interface AccountInstance {
  id: string;
  pin: string;
  name: string;
  phone: string;
  account: string;
  identity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type AccountListResponse = ResponseDataForPage<AccountInstance>;

export interface AccountListQuery extends RequestForPage {
  account: string;
  roleId: string;
}

export type AccountListQueryAxios = AxiosRequestConfig & {
  params: AccountListQuery;
};

export type AccountDetailQuery = {
  id: string;
};

export type AccountDetailQueryAxios = AxiosRequestConfig & {
  params: AccountDetailQuery;
};

export type AccountDetailResponse = ResponseData<AccountInstance>;

export type AccountPostData = {
  account: string;
  password: string;
  name: string;
  phone: string;
};

export type AccountPostDataAxios = AxiosRequestConfig & {
  data: AccountPostData;
};
