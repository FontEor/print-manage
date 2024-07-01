import { ResponseData } from '@/types/response';

export namespace Menu {
  export enum MenuType {
    menu = 1,
    button = 2,
  }
  export interface Meta {
    id: string;
    alias: string;
  }
  export interface Instance {
    id: number;
    type: MenuType;

    code: string;
    name: string;
    url: null | string;
    parentId?: number;
    children?: Menu[];
  }

  export interface UpdateMenu {
    menus: Menu.Instance[];
    buttons: Record<string, string>;
  }

  export type ListResponse = ResponseData<{
    identity: 1 | 2 | 3; // 1管理员 2拥有者 3成员
    menus: [];
  }>;
}
