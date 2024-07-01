import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import lodash from 'lodash';
import { Session } from '@/utils/session';

class RouterGuard {
  allowCode: string[] = [];
  menuCodePath: Record<string, string[]> = {};
  constructor() {}
  setAllowCode(code: string[]) {
    this.allowCode = code;
  }
  setMenuCodePath(menuPath: Record<string, string[]>) {
    // console.log('setMenuCodePath', menuPath);
    this.menuCodePath = menuPath;
  }
  getMenuCodePath(code: string): string[] {
    return lodash.clone(this.menuCodePath[code] || []);
  }
  validMenuAuthority(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    if (to.meta.usfCode) {
      if (to.name) {
        const code = to.meta.usfCode as string;
        if (this.allowCode.includes(code)) {
          next();
        } else {
          next(false);
        }
      }
    } else {
      next();
    }
  }

  validNeedChooseOrgId(to: RouteLocationNormalized) {
    if (to.meta.needOrgId) {
      const orgId = Session.getOrgId();
      if (!orgId) {
        return true;
      }
    }
  }
}

export default new RouterGuard();
