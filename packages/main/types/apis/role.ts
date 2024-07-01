import { ResponseData, ResponseDataForPage } from '../response';
import { RequestForPage } from '../request/requestV1';
import { AxiosRequestConfig } from 'axios';
export interface RoleInstance {
  id: string;
  name: string;
  identity: number;
  type: number;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RoleDetailResponse extends RoleInstance {
  Powers: Array<RoleDetailArray>;
}

export type RoleDetailArray = {
  type: string;
  id: string;
  name: string;
  RelationRolesPower: {
    id: number;
    role_id: string;
    power_id: string;
    RoleId: string;
    PowerId: string;
  };
};
export type RoleListResponse = ResponseDataForPage<RoleInstance>;

export interface RoleListQuery extends RequestForPage {
  name: string;
  id: string;
}

export interface RoleListQueryId {
  id: string;
}

export type RoleListQueryAxios = AxiosRequestConfig & {
  params: RoleListQuery;
};
