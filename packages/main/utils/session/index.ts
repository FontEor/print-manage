import { requestV1 } from '@/axios/request';
import store from '@/store';
import { parseQuery, useRoute } from 'vue-router';

export class Session {
  constructor() {}
  static setOrgId(orgId: number | undefined) {
    store.commit('updateCurrentOrgId', orgId);
  }
  static setOrgName(orgName: string | undefined) {
    store.commit('updateCurrentOrgName', orgName);
  }
  static getOrgId(): number | undefined {
    const orgId = store.state.currentOrgId;
    if (typeof orgId === 'number') {
      return orgId;
    } else {
      const hash = location.hash || '';
      const query = parseQuery(hash.split('?')[1] || '');
      if (query.orgId) {
        Session.setOrgId(+query.orgId);
        return +query.orgId;
      }
      return undefined;
    }
  }
  static getOrgNameByRemote() {
    const id = Session.getOrgId();
    if (id) {
      return new Promise((resolve, reject) => {
        // 获取系统名称
        requestV1
          .systemDetail({
            replacements: {
              id: +id,
            },
          })
          .then((response) => {
            const detail = response.data;
            const name = detail.name;
            return resolve(name);
          })
          .catch(reject);
      });
    } else {
      return Promise.resolve('');
    }
  }
  static getOrgName(): string | undefined {
    const orgName = store.state.currentOrgName;
    if (typeof orgName === 'string') {
      return orgName;
    } else {
      return undefined;
    }
  }
  static removeOrgId() {
    sessionStorage.removeItem('user-org-id');
    sessionStorage.removeItem('user-org-name');
  }
}
