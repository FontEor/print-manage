import Qs from 'qs';
import lodash from 'lodash';
import { RequestV1 } from '@/types/request/requestV1';
import { propertyFormatList } from '../format/property/list';
import { userPinProxy } from '../proxy/user';
import { deconstructionTimestamp, formatDataString } from '../utils';
import { PluginInstall, PluginForceUpdate } from '@/types/apis/plugin';
import { Logs } from '@/types/apis/logs';
import { Bluetooth } from '@/types/apis/bluetooth';
import { MessagePush } from '@/types/apis/messagePush';
import { wrapRequest } from './wrapRequest';

export const requestV1: RequestV1 = {
  // 菜单请求
  menuGet: wrapRequest({ url: '/menu', method: 'get' }),
  // 账户请求
  accountList: wrapRequest({ url: '/account/list', method: 'get' }),
  accountDetail: wrapRequest({ url: '/account', method: 'get' }),
  accountAdd: wrapRequest({ url: '/account', method: 'post' }),
  // 角色列表
  roleList: wrapRequest({ url: '/role/list', method: 'get' }),
  roleAll: wrapRequest({ url: '/role/all', method: 'get' }),
  roleDetail: wrapRequest({ url: '/role/', method: 'get' }),
  roleDelete: wrapRequest({ url: 'role', method: 'delete' }),
  // roleModify::wrapRequest({url:'/role/',method:'put'}),
  // 数据源相关接口
  sourceList: wrapRequest({ url: '/orgs/sources', method: 'get' }),
  sourceDetail: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}',
    method: 'get',
  }),
  sourceCreate: wrapRequest({ url: '/orgs/{id}/sources', method: 'post' }),
  sourceDelete: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}',
    method: 'delete',
  }),
  sourceUpdate: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}',
    method: 'put',
  }),
  // 属性相关接口
  propertyList: wrapRequest(
    { url: '/orgs/{id}/sources/{sourceId}/property/list', method: 'get' },
    propertyFormatList,
  ),
  propertyCreate: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/property',
    method: 'post',
  }),
  propertyDetail: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/property/{proId}',
    method: 'get',
  }),
  propertyUpdate: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/property',
    method: 'put',
  }),
  propertyDelete: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/property/{proId}',
    method: 'delete',
  }),
  propertyImport: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/property/import',
    method: 'post',
  }),
  propertyRelationEnum: wrapRequest({
    url: '/orgs/{orgId}/sources/{sourceId}/property/bindEnumItem',
    method: 'put',
  }),
  // 系统相关接口
  systemNoPageList: wrapRequest({ url: '/orgs', method: 'get' }),
  systemList: wrapRequest({ url: '/orgs', method: 'get' }),
  systemCreate: wrapRequest({ url: '/orgs', method: 'post' }),
  systemDetail: wrapRequest({ url: '/orgs/{id}', method: 'get' }),
  systemUpdate: wrapRequest({ url: '/orgs/{id}', method: 'put' }),
  systemDelete: wrapRequest({ url: '/orgs/{id}', method: 'delete' }),
  // 自定义模板相关接口
  openTemplateList: wrapRequest({ url: '/orgs/templates', method: 'get' }),
  openTemplateCreate: wrapRequest({
    url: '/orgs/{id}/templates',
    method: 'post',
  }),
  openTemplateDetail: wrapRequest({
    url: '/orgs/{id}/templates/{temId}',
    method: 'get',
  }),
  openTemplateUpdate: wrapRequest({
    url: '/orgs/{id}/templates/{temId}',
    method: 'put',
  }),
  openTemplateDelete: wrapRequest({
    url: '/orgs/{id}/templates/{temId}',
    method: 'DELETE',
  }),
  // 面单类型 好像已经废弃
  tempSpecifsList: wrapRequest({ url: '/tempSpecifs', method: 'get' }),
  // 这个接口准备替换掉
  deliveryList: wrapRequest({ url: '/delivery', method: 'get' }),
  // 模板接口
  templateImageList: wrapRequest({
    url: '/orgs/templateImages',
    method: 'get',
  }),
  // 版本管理相关接口
  versionList: wrapRequest({
    url: '/orgs/{id}/templates/{temId}/versions',
    method: 'get',
  }),
  versionPublish: wrapRequest({
    url: '/orgs/{id}/templates/{temId}/versions/{verId}',
    method: 'put',
  }),
  versionDelete: wrapRequest({
    url: '/orgs/{id}/templates/{temId}/versions/{verId}',
    method: 'delete',
  }),
  versionSetDefault: wrapRequest({
    url: '/orgs/{id}/templates/{temId}/versions/{verId}/default',
    method: 'post',
  }),
  // 要素管理相关接口
  elementList: wrapRequest({ url: 'element', method: 'get' }),
  elementCreate: wrapRequest({ url: 'element', method: 'post' }),
  elementDetail: wrapRequest({ url: 'element/{elementId}', method: 'get' }),
  elementUpdate: wrapRequest({ url: 'element/{elementId}', method: 'put' }),
  elementDelete: wrapRequest({ url: 'element/{elementId}', method: 'DELETE' }),
  systemSourcePropertyList: wrapRequest({
    url: '/proxy/source/property',
    method: 'get',
  }),
  uploadImage: wrapRequest({ url: '/element/uploadImage', method: 'post' }),
  // 用户相关接口
  getUserInfo: wrapRequest({ url: '/auth/user/current', method: 'get' }),
  menusList: wrapRequest({ url: '/menus', method: 'get' }),
  // ERP接口
  userErpInfo: wrapRequest({ url: '/users/{erp}', method: 'get' }),
  logout: wrapRequest({ url: '/permission/logout', method: 'get' }),
  // Pin相关接口
  userPinInfo: wrapRequest({ url: '/users/pin/{pin}', method: 'get' }),
  userPinIsBPin: wrapRequest({ url: '/users/isBPin/{pin}', method: 'get' }),
  // 前端本地代理接口
  userPinProxy: userPinProxy,

  // 标准模板相关
  userTemplateList: wrapRequest({ url: '/orgs/tempOrgs', method: 'get' }),
  userTemplateCreate: wrapRequest({
    url: '/orgs/{orgId}/tempOrgs',
    method: 'post',
  }),
  // 登陆
  login: wrapRequest({ url: '/login', method: 'post' }),
  // 下载图片
  loadImg: wrapRequest({
    url: '/common/download',
    method: 'get',
    responseType: 'blob',
    headers: { Accept: 'application/octet-stream' },
  }),
  // 自定义相关接口
  customList: wrapRequest({ url: '/custom/orgs/customs', method: 'get' }),
  customDetail: wrapRequest({
    url: '/custom/orgs/customs/{temId}',
    method: 'get',
  }),
  customUpdate: wrapRequest({
    url: '/custom/orgs/customs/{temId}',
    method: 'put',
  }),
  customDelete: wrapRequest({
    url: '/custom/orgs/customs/{temId}',
    method: 'delete',
  }),

  // 承运商相关接口
  expressList: wrapRequest({ url: '/delivery', method: 'get' }),
  expressCreate: wrapRequest({ url: '/delivery', method: 'post' }),
  expressUpdate: wrapRequest({ url: '/delivery', method: 'put' }),
  expressDelete: wrapRequest({
    url: '/delivery/{deliveryId}',
    method: 'delete',
  }),
  expressDetail: wrapRequest({ url: '/delivery/{deliveryId}', method: 'get' }),
  expressUploadLogo: wrapRequest({
    url: '/delivery/uploadImage',
    method: 'post',
  }),
  expressRelationList: wrapRequest({
    url: '/deliveryRelation/getRelations/{orgId}',
    method: 'get',
  }),
  expressRelation: wrapRequest({
    url: '/deliveryRelation/updateRelations/{orgId}',
    method: 'post',
  }),

  // 仅仅与 JWMS 相关的接口
  jwmsCreateCustom: wrapRequest({
    url: '/custom/orgs/{orgId}/customsJwms',
    method: 'post',
  }),
  jwmsCreateTemplate: wrapRequest({
    url: '/orgs/{orgId}/templatesJwms',
    method: 'post',
  }),
  jwmsTransfromTemplate: wrapRequest({
    url: '/orgs/{id}/templates/{temId}/versions/transform',
    method: 'post',
  }),
  jwmsTransfromSave: wrapRequest({
    url: '/orgs/{orgId}/templates/{temId}/versions/transform/save',
    method: 'post',
  }),
  // 白名单
  whiteLists: wrapRequest({ url: '/whiteLists', method: 'get' }),
  whiteListsReview: wrapRequest({ url: '/whiteLists/review', method: 'get' }),
  whiteListsQueryIsvReview: wrapRequest({
    url: '/whiteLists/queryReview',
    method: 'get',
  }),
  whiteListsQueryMerchantReview: wrapRequest({
    url: '/whiteLists/queryReview',
    method: 'get',
  }),
  whiteListsDownloadPdf: wrapRequest({
    url: '/common/downloadPdf',
    method: 'get',
    responseType: 'blob',
    headers: { Accept: 'application/octet-stream' },
  }),
  // 插件相关接口
  pluginInstallList: wrapRequest({
    url: '/plugin/installed/queryPage',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: [
      function (data: PluginInstall.ListQuery): string {
        if (data) {
          if (data.updateTimes) {
            deconstructionTimestamp(
              data.updateTimes,
              ['pluginUpgradeTimeStart', 'pluginUpgradeTimeEnd'],
              data,
            );
          }
          if (data.installTimes) {
            deconstructionTimestamp(
              data.installTimes,
              ['firstInstallTimeStart', 'firstInstallTimeEnd'],
              data,
            );
          }
          delete data.installTimes;
          delete data.updateTimes;
          return JSON.stringify(data);
        }
        return '';
      },
    ],
  }),
  pluginVersionList: wrapRequest({
    url: '/plugin/version/queryPage',
    method: 'get',
  }),
  pluginVersionCreate: wrapRequest({
    url: '/plugin/version/add',
    method: 'post',
  }),
  pluginVersionPush: wrapRequest({
    url: '/plugin/version/push{id}',
    method: 'post',
  }),
  pluginVersionUpDown: wrapRequest({
    url: '/plugin/version/shelf',
    method: 'post',
  }),
  pluginVersionCurrentGet: wrapRequest({
    url: '/plugin/version/getCurrentPushVersion',
    method: 'post',
  }),
  pluginVersionDetail: wrapRequest({
    url: '/plugin/version/version/{id}',
    method: 'get',
  }),
  pluginVersionUpdate: wrapRequest({
    url: '/plugin/version/edit/{id}',
    method: 'post',
  }),
  pluginVersionDelete: wrapRequest({
    url: '/plugin/version/{id}',
    method: 'delete',
  }),
  // 强制升级相关
  pluginForceList: wrapRequest({
    url: '/force_upgrade/list_all',
    method: 'get',
    paramsSerializer: function (params) {
      params.page = params.from - 1;
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  }),
  pluginStartUpgrade: wrapRequest({
    url: '/force_upgrade/start_upgrade',
    method: 'post',
    transformRequest: [
      function (data: PluginForceUpdate.PauseUpgradeAxios) {
        return Qs.stringify(data, { arrayFormat: 'repeat' });
      },
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }),
  pluginPauseUpgrade: wrapRequest({
    url: '/force_upgrade/pause_upgrade',
    method: 'post',
    transformRequest: [
      function (data: PluginForceUpdate.PauseUpgradeAxios) {
        return Qs.stringify(data, { arrayFormat: 'repeat' });
      },
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }),
  pluginResumeUpgrade: wrapRequest({
    url: '/force_upgrade/resume_upgrade',
    method: 'post',
    transformRequest: [
      function (data: PluginForceUpdate.PauseUpgradeAxios) {
        return Qs.stringify(data, { arrayFormat: 'repeat' });
      },
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }),
  pluginImportPins: wrapRequest({
    url: '/force_upgrade/batch_import',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  pluginSetSuccessPercentage: wrapRequest({
    url: '/force_upgrade/set_percentage',
    method: 'post',
    transformRequest: [
      function (data: PluginForceUpdate.PauseUpgradeAxios) {
        return Qs.stringify(data, { arrayFormat: 'repeat' });
      },
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }),
  // 日志列表接口
  logsList: wrapRequest({
    url: '/plugin/printLog/queryPage',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: [
      function (data: Logs.ListQuery): string {
        if (data) {
          if (data.printTimes) {
            deconstructionTimestamp(data.printTimes, ['printTimeStart', 'printTimeEnd'], data);
          }
          delete data.printTimes;
          return JSON.stringify(data);
        }
        return '';
      },
    ],
  }),
  // 日志面单预览
  // logPreview: wrapRequest({ url: '/orgs/{id}/templates/{temId}/versions/printLog/preview', method: 'post' }),
  // 磊哥说 id 和 temId 随便传递
  logPreview: wrapRequest({
    url: '/orgs/1/templates/1/versions/printLog/preview',
    method: 'post',
  }),
  logTemplateDownload: wrapRequest({
    url: '/template/proxy',
    baseURL: '/apip',
    method: 'post',
  }),

  templateReplaceList: wrapRequest({
    url: '/templateMapping/queryPage',
    method: 'get',
  }),
  templateReplaceCreate: wrapRequest({
    url: '/templateMapping/save',
    method: 'post',
  }),
  templateReplaceUpdate: wrapRequest({
    url: '/templateMapping/edit',
    method: 'post',
  }),
  templateReplaceDelete: wrapRequest({
    url: '/templateMapping/deleteById',
    method: 'delete',
  }),
  templateReplaceStandardList: wrapRequest({
    url: '/templateMapping/searchTemplateInfo',
    method: 'get',
  }),
  // 蓝牙相关
  bluetoothPrintType: wrapRequest({
    url: '/bluetooth/printtype',
    method: 'get',
  }),
  bluetoothList: wrapRequest({
    url: '/bluetooth/devices',
    method: 'get',
    paramsSerializer: function (params: Bluetooth.ListQuery): string {
      const query: Bluetooth.ListEndQuery = {
        tradeName: params.tradeName,
        model: params.tradeName,
        pageNum: params.from || 1,
        pageCount: params.size || 20,
      };
      return Qs.stringify(query, { arrayFormat: 'repeat' });
    },
  }),
  bluetoothCreate: wrapRequest({
    url: '/bluetooth/device',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  bluetoothUpdate: wrapRequest({
    url: '/bluetooth/device/{id}',
    method: 'put',
  }),
  bluetoothDetail: wrapRequest({
    url: '/bluetooth/device/{id}',
    method: 'get',
  }),
  bluetoothDelete: wrapRequest({
    url: '/bluetooth/device/{id}',
    method: 'delete',
  }),
  // 消息推送相关
  messagePushList: wrapRequest({
    url: '/notice/list',
    method: 'get',
    transformResponse: [
      function (data) {
        data = JSON.parse(data);
        const list = lodash.get(data, 'data', []);
        list.forEach((item: MessagePush.Instance) => {
          item.createTime = formatDataString(item.createTime, 'YYYY-MM-DD HH:mm:ss');
          item.examineTime = formatDataString(item.examineTime, 'YYYY-MM-DD HH:mm:ss');
        });
        return data;
      },
    ],
  }),
  messagePushCreate: wrapRequest({
    url: '/notice/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: [
      function (data: MessagePush.CreateData): string {
        if (data) {
          if (data.time) {
            data.time = formatDataString(data.time, 'HH:mm:00');
          }
          return JSON.stringify(data);
        }
        return '';
      },
    ],
  }),
  messagePushUpdate: wrapRequest({
    url: '/notice/update/{id}',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: [
      function (data: MessagePush.CreateData): string {
        if (data) {
          if (data.time) {
            data.time = formatDataString(data.time, 'HH:mm:00');
          }
          return JSON.stringify(data);
        }
        return '';
      },
    ],
  }),
  // 枚举管理相关
  enumList: wrapRequest({ url: '/orgs/enumItem', method: 'get' }),
  enumImport: wrapRequest({
    url: '/orgs/{orgId}/enumItem/import',
    method: 'post',
  }),
  enumUpdate: wrapRequest({
    url: '/orgs/{orgId}/enumItem/update/{enumId}',
    method: 'post',
  }),
  enumDelete: wrapRequest({
    url: '/orgs/{orgId}/enumItem/del/{enumId}',
    method: 'delete',
  }),
  enumDetail: wrapRequest({
    url: '/orgs/{orgId}/enumItem/{enumId}',
    method: 'get',
  }),
  messagePushDetail: wrapRequest({ url: '/notice/get/{id}', method: 'get' }),
  messagePushExamine: wrapRequest({ url: '/notice/audit', method: 'post' }),
};
