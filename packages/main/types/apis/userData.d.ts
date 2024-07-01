import { ResponseData } from '../response';
import { General } from '../general';

export namespace UserData {
  // 基本实例结构
  export interface Instance {
    nickname: string;
    createTime: null | string;
    email: null | string;
    extendInfo: null | string;
    mobile: null | string;
    nickname: string;
    password: null | string;
    pin: 'liyankai6' | string;
    updateUser: null | string;
  }

  // 查询当前登录用户信息
  export type UserAxios = {};
  export type UserResponse = ResponseData<Instance>;

  export interface Menu {}

  export enum IdentityEnum {
    1 = '管理员', // admin
    2 = '负责人', // owner
    3 = '系统成员', // member
  }

  export interface MenuData {
    identity: number;
    menus: [];
  }

  export type MenuResponse = ResponseData<MenuData>;

  // ERP 接口返回数据实例
  export interface ErpInstance {
    createTime?: string;
    createUser?: string;
    deptName: string;
    id?: number;
    identity?: number;
    isDelete?: number;
    name: string;
    orgCode?: string;
    orgId?: string;
    phone: string;
    pin: string;
    ts?: string;
    type?: number;
    updateTime?: string;
    updateUser?: string;
    version?: number;
  }

  // Pin 接口返回数据实例
  export interface PinUserDataInstance {
    pin: string;
    nickname: string;
    password: string;
    email: string;
    mobile: string;
    extendInfo: General.G_S_Object;
    updateUser: string;
    createTime: string;
    comName: string;
    bpin: boolean;
  }

  // 查询pin用户信息
  export type UserPinQueryAxios = {
    replacements: {
      pin: string;
    };
  };

  export type UserPinQueryResponse = ResponseData<PinUserDataInstance>;

  // 查询ERP用户信息
  export type ErpPinQueryAxios = {
    replacements: {
      erp: string;
    };
  };

  export type ErpPinQueryResponse = ResponseData<ErpInstance>;

  // 查询用户是否为B pin用户
  export type UserPinIsBPinAxios = {
    replacements: {
      pin: string;
    };
  };
  export type UserPinIsBPinResponse = ResponseData<boolean>;

  // 查询用户或者ERP pin
  export type UserAndErpInstance = {
    pin: string;
    deptName: string;
    // pin类型 ERP 0 CPin 1 BPin 2 石忠旭定的
    type: number;
    label: string;
    name: string;
  };

  export type LogoutAxios = {
    params: {
      returnUrl: string;
    };
  };

  export type UserAndErpResponse = ResponseData<UserAndErpInstance[]>;
}
