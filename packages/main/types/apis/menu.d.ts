import { ResponseDataForPage } from '@/types/response';
export namespace MenuPermission {
  export interface MenuInstance {
    id: number;
    name: string;
    code: string;
    url: string;
    parentId: number;
    level: number;
    seq: number;
    type: number;
    icon: string;
    parentIds: string;
    children: MenuInstance[] | null;
    isHasChild: boolean;
    ext1: string;
    ext2: string;
    ext3: string;
    ext4: string;
    ext5: string;
    ext6: string;
    ext7: string;
    ext8: string;
    ext9: string;
    ext10: string;
    extendedField: string;
    route: string;
  }

  export type MenuListResponse = ResponseDataForPage<MenuInstance>;

  export type MenuQuery = {
    parentResourceCode: string;
  };

  export type MenuQueryAxios = {
    params: MenuQuery;
  };
}
