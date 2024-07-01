import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { SourceData, Property } from '../../../types/apis/sourceData';
import { CascaderData } from '../../../types/cascader';

export type CascaderSSPConfig = AxiosRequestConfig &
  Property.ListAxios &
  SourceData.ListQuery & {
    level: number;
    proxyAjax: string;
    proxyArgs: number;
  };

export class SystemSourceProperty {
  static requestHandle(config: CascaderSSPConfig) {
    const level = config.params.level;
    delete config.params.level;
    config.proxyAjax = 'ssp';
    switch (+level) {
      case 0:
        config.proxyArgs = 0;
        config.url = '/orgs/sources';
        config.params.isPage = config.params.isPage || 0;
        break;
      case 1:
        config.proxyArgs = 1;
        config.url = `/orgs/${config.params.id}/sources/${config.params.sourceId}/property/list`;
        delete config.params.id;
        delete config.params.sourceId;
        break;
      default:
        ElMessage.error('level 参数错误');
        throw new Error('level参数错误 main/axios/proxy/cascader/ssp');
    }
  }
  static responseHandle(response: AxiosResponse) {
    const config = response.config as CascaderSSPConfig;
    if (config.proxyAjax === 'ssp') {
      switch (config.proxyArgs) {
        case 0:
          response.data.data = SystemSourceProperty.formatSourceData(response.data.data);
          break;
        case 1:
          response.data.data = SystemSourceProperty.formatPropertyData(response.data.data);
          break;
      }
    }
  }
  // 过滤掉没有子集的数据
  static formatSourceData(
    list: (SourceData.Instance & CascaderData.Instance & { hasChild: number })[] = [],
  ) {
    list.forEach((item) => {
      item.cascaderLabel = item.name;
      item.cascaderValue = item.id;
    });
    // 过滤掉没有子集的数据
    return list.filter((item) => {
      return item.hasChild === 1;
    });
  }
  static formatPropertyData(
    list: (Property.Instance & CascaderData.Instance & { hasChild: number })[] = [],
  ) {
    list.forEach((item) => {
      item.cascaderLabel = item.propertyName;
      item.cascaderValue = item.id;
    });
    return list.filter((item) => {
      // 如果不是字符串 并且 没有叶子结点
      const boolean = item.dataType !== 2 && item.hasChild !== 1;
      return !boolean;
    });
  }
}
