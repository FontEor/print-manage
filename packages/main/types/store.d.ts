import { UserData } from './apis/userData';
import { RouteRecordRaw, RouteLocationRaw } from 'vue-router';
import { MenuPermission } from '@/types/apis/menu';

export type Tabs = RouteLocationRaw & {
  closable: boolean;
  name: string;
  route?: RouteRecordRaw;
};

export default interface RootStateTypes {
  user?: UserData.Instance;
  menus: MenuPermission.Instance[];
  menuSides: MenuPermission.Instance[];

  menuSideOpened: string[];
  menuSideActive: string;
  menuCodes: string[];
  menuCurrent: string;

  currentTab: Tabs | undefined;
  tabs: Tabs[];
  buttons: Record<string, boolean>;
  currentOrgId?: number;
  currentOrgName?: string;
  routerLoading: boolean;
}

export interface UpdateMenuCurrentData {
  activeMenuPath: string[];
}
