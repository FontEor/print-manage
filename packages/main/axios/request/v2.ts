import { RequestV2 } from '@/types/request/requestV2';
import { wrapRequestV2 as wrapRequest } from './wrapRequest';
import { adCreateOrUpdateToParams, templateListToParams, templateMarketListToForm } from './utils';
import { propertyFormatList } from '@/axios/format/property/list';
import type { JoinSystem } from '@/types/apis/join-system';
import { AdvertisingPlan } from '@/types/apis/advertising-plan';
import Qs from 'qs';
import { dateToString, millisecondToString, stringToMillisecond } from '@/utils/time';
import { urlPrefixConcat } from '@/utils/url';
import { WaybillTemplateReview } from '@/types/apis/waybill-template-review';
import { reviewStatusEnum } from '@/enums/reviewStatus';
import { BusinessTemplateConfig } from '@/types/apis/business-template-config';
import { formatBusinessCodeTypeLabel } from '@/enums/business';
import lodash from 'lodash';
import { TemplateClassification } from '@/types/apis/template-classification';
import { TemplateCategory } from '@/types/apis/template-category';

export const requestV2: RequestV2 = {
  menusList: wrapRequest({ url: '/menus', method: 'get' }),
  // 菜单权限相关
  menuList: wrapRequest({
    url: '/permission/queryAllChildResourcesByParentCode',
    method: 'get',
  }),
  menuAllList: wrapRequest({
    url: '/permission/findMemuByUser',
    method: 'get',
  }),
  // 系统相关接口
  systemNoPageList: wrapRequest({ url: '/orgs', method: 'get' }),
  // 获取用户拥有权限的系统
  userOwnedSystemList: wrapRequest({ url: '/permission/queryUserOwnedOrgs', method: 'get' }),
  // 获取用户是否存在可申请系统（校验用户是否在usf权限平台注册）
  ableToJoinSystem: wrapRequest({
    url: '/permission/queryUserInfo',
    method: 'get',
  }),
  // 可申请系统列表
  applySystemList: wrapRequest({
    url: '/permission/queryOrgList',
    method: 'get',
    paramsSerializer: function (data: JoinSystem.ListQuery) {
      const query: JoinSystem.ListQuery = {
        name: data?.name,
      };
      return Qs.stringify(query);
    },
  }),
  // 申请加入系统
  applyToJoinSystem: wrapRequest({
    url: '/permission/joinOrg',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  systemList: wrapRequest({ url: '/orgs/queryOrgList', method: 'get' }),
  systemCreate: wrapRequest({ url: '/orgs', method: 'post' }),
  systemDetail: wrapRequest({ url: '/orgs/{id}', method: 'get' }),
  systemUpdate: wrapRequest({ url: '/orgs/{id}', method: 'put' }),
  // ERP接口
  userErpInfo: wrapRequest({ url: '/users/{erp}', method: 'get' }),
  // 以下为新增接口
  // 获取模板分类列表
  // TODO 以后合并一下逻辑 接口改造了 等待 分类需求上线的时候 再处理 影响了别的需求
  categoryList: wrapRequest(
    {
      url: '/common/template/category',
      method: 'get',
      params: {
        isPage: 0,
      },
    },
    function (response: TemplateCategory.ListOriginalResponse) {
      return (response.data || []).map((item) => {
        const { id, code, name } = item.category;
        return {
          id,
          code,
          name,
          children: item.children.map((item) => {
            const { id, code, name } = item;
            return {
              id,
              code,
              name,
            };
          }),
        };
      });
    },
  ),
  templateClassifyListPageList: wrapRequest(
    {
      url: '/common/template/category',
      method: 'get',
    },
    function (
      response: TemplateClassification.ListOriginalResponse,
    ): TemplateClassification.ListResponse {
      return {
        ...response,
        data: (response.data || []).map((item) => {
          const instance = item.category;
          const result: TemplateClassification.ListInstance = {
            ...instance,
            level: 1,
            createTime: dateToString(instance.createTime),
            updateTime: dateToString(instance.updateTime),
            children: item.children.map((child) => {
              return {
                ...child,
                level: 2,
                createTime: dateToString(child.createTime),
                updateTime: dateToString(child.updateTime),
              };
            }),
          };
          return result;
        }),
      };
    },
  ),
  templateClassifyCreate: wrapRequest({
    url: '/category/add',
    method: 'post',
  }),
  templateClassifyUpdate: wrapRequest({
    url: '/category/{id}',
    method: 'put',
  }),
  templateClassifyDelete: wrapRequest({
    url: '/category/{id}',
    method: 'delete',
  }),
  templateClassifyDetail: wrapRequest({
    url: '/category/{id}',
    method: 'get',
  }),
  // 获取当前系统下的标签
  tagListOfCurrentSystem: wrapRequest({
    url: '/orgs/{orgId}/tag/',
    method: 'get',
  }),
  // 获取所有系统下的tag
  tagListOfAllSystem: wrapRequest({
    url: '/orgs/{orgId}/tag/forTempMarket',
    method: 'get',
  }),
  // 获取本系统下的tag 以及 从模板市场获取到的模板的tag
  tagListOfTempListAndRelationTemplate: wrapRequest({
    url: '/orgs/{orgId}/tag/forTempList',
    method: 'get',
  }),
  tagCreate: wrapRequest({
    url: '/orgs/{orgId}/tag/save',
    method: 'post',
  }),
  tagUpdate: wrapRequest({
    url: '/orgs/{orgId}/tag/{id}',
    method: 'put',
  }),
  tagDelete: wrapRequest({
    url: '/orgs/{orgId}/tag/{id}',
    method: 'delete',
  }),
  // 创建模板
  templateCreate: wrapRequest({
    url: '/orgs/{id}/templates',
    method: 'post',
  }),
  // 创建模板
  templateUpdate: wrapRequest({
    url: '/orgs/{orgId}/templates/{code}',
    method: 'put',
  }),
  // 获取模板列表
  templateList: wrapRequest({
    url: '/orgs/templates',
    method: 'get',
    paramsSerializer: templateListToParams,
  }),
  // 发布/取消发布
  templatePublish: wrapRequest({
    url: '/orgs/{orgId}/publishTemp/{code}',
    method: 'PUT',
  }),
  templateShare: wrapRequest({
    url: '/share',
    method: 'post',
  }),
  templateCancelShare: wrapRequest({
    url: '/cancelshare',
    method: 'post',
  }),
  templateMarketList: wrapRequest({
    url: '/market/templatelist',
    method: 'post',
    transformRequest: templateMarketListToForm,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  templateAddToList: wrapRequest({
    url: '/addToTemplateList',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  templateAddCustonToList: wrapRequest({
    url: '/orgs/{orgId}/tempOrgs',
    method: 'post',
  }),
  templateAddAllCustonToList: wrapRequest({
    url: '/orgs/{orgId}/template/version/{versionId}',
    method: 'post',
  }),
  templateDetail: wrapRequest({
    url: '/orgs/{orgId}/templates/{code}',
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
  /**
   * @description: 新建属性
   * */
  propertyCreate: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/property',
    method: 'post',
  }),
  propertyDetail: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/property/{proId}',
    method: 'get',
  }),
  /**
   * @description: 修改属性
   * */
  propertyUpdate: wrapRequest({
    url: '/orgs/{id}/sources/{sourceId}/singleProperty',
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
  adPrintChannelList: wrapRequest({
    url: '/ad/channel',
    method: 'get',
  }),
  adCityList: wrapRequest({
    url: '/ad/city',
    method: 'get',
  }),
  adWhiteListDetail: wrapRequest({
    url: '/ad/white_list',
    method: 'get',
  }),
  adWhiteListUpdate: wrapRequest({
    url: '/ad/white_list/add',
    method: 'post',
  }),
  adList: wrapRequest(
    {
      url: '/ad/list',
      method: 'get',
      paramsSerializer: (params: AdvertisingPlan.ListQuery) => {
        const { timeRange = [], ...rest } = params;
        const [startTime, endTime] = timeRange;
        const query = {
          ...rest,
          startTime: startTime ? stringToMillisecond(startTime) : undefined,
          endTime: endTime ? stringToMillisecond(endTime) : undefined,
        };
        return Qs.stringify(query, { arrayFormat: 'repeat' });
      },
    },
    function (data): AdvertisingPlan.ListResponse {
      const list = data.data as AdvertisingPlan.Instance[];
      const format = 'YYYY-MM-DD HH:mm';
      return {
        ...data,
        data: list.map((item) => {
          return {
            ...item,
            image: urlPrefixConcat(item.image),
            startTime: millisecondToString(item.startTime, format),
            endTime: millisecondToString(item.endTime, format),
            createTime: millisecondToString(item.createTime),
            updateTime: millisecondToString(item.updateTime),
          };
        }),
      };
    },
  ),
  adCreate: wrapRequest({
    url: '/ad/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: adCreateOrUpdateToParams,
  }),
  adUpdate: wrapRequest({
    url: '/ad/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: adCreateOrUpdateToParams,
  }),
  adDetail: wrapRequest({
    url: '/ad/{id}',
    method: 'get',
  }),
  // 承运商相关接口
  expressList: wrapRequest({ url: '/delivery', method: 'get' }),

  // 审核相关接口
  waybillTemplateReviewList: wrapRequest(
    {
      url: '/templateReviews',
      method: 'get',
    },
    function (data: WaybillTemplateReview.ListResponse) {
      return {
        ...data,
        data: (data.data || []).map((item) => {
          return {
            ...item,
            status: reviewStatusEnum[item.status],
            createTime: dateToString(item.createTime),
            reviewTime: dateToString(item.reviewTime),
          };
        }),
      };
    },
  ),
  waybillTemplateReviewDetail: wrapRequest({
    url: '/templateReview/{id}',
    method: 'get',
  }),

  // 商家模板配置
  businessTemplateConfigList: wrapRequest(
    {
      url: '/orgs/{orgId}/trader/template/mapping',
      method: 'get',
      paramsSerializer: (params: BusinessTemplateConfig.QueryData): string => {
        let { categories } = params;
        categories = categories || [];
        const query: BusinessTemplateConfig.EndQueryData = {
          ...lodash.omit(params, ['categories']),
          templateFirstCategoryCode: categories[0],
          templateSecondCategoryCode: categories[1],
        };
        return Qs.stringify(query, { arrayFormat: 'repeat' });
      },
    },
    function (data: BusinessTemplateConfig.ListResponse) {
      console.log(data);
      data.data.forEach((item) => {
        item.traderCodeName = formatBusinessCodeTypeLabel(item.traderCodeType);
      });
      return data;
    },
  ),
  businessTemplateConfigDetail: wrapRequest({
    url: '/orgs/{orgId}/trader/template/mapping/{id}',
    method: 'get',
  }),
  businessTemplateConfigCreate: wrapRequest({
    url: '/orgs/{orgId}/trader/template/mapping',
    method: 'post',
    transformRequest: (data: BusinessTemplateConfig.CreateData): string => {
      const result: BusinessTemplateConfig.EndCreateData = {
        ...lodash.omit(data, 'categories'),
        templateFirstCategoryCode: data.categories[0],
        templateSecondCategoryCode: data.categories[1],
      };
      return JSON.stringify(result);
    },
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  businessTemplateConfigUpdate: wrapRequest({
    url: '/orgs/{orgId}/trader/template/mapping/{id}',
    method: 'put',
  }),
  businessTemplateConfigDelete: wrapRequest({
    url: '/orgs/{orgId}/trader/template/mapping/{id}',
    method: 'delete',
  }),
  businessNameByBusinessCode: wrapRequest({
    url: '/orgs/{orgId}/trader/template/mapping/traderName',
    method: 'get',
  }),
  businessGetTemplateByCode: wrapRequest({
    url: '/orgs/{orgId}/trader/template/mapping/tempCode',
    method: 'get',
  }),

  // 灰度升级相关接口
  grayUpgradeList: wrapRequest({
    url: '/grayupgradestrategy',
    method: 'get',
  }),
  grayUpgradeDetail: wrapRequest({
    url: '/grayupgradestrategy/{id}',
    method: 'get',
  }),
  grayUpgradeCreate: wrapRequest({
    url: '/grayupgradestrategy',
    method: 'post',
  }),
  grayUpgradeClose: wrapRequest({
    url: '/grayupgradestrategy/closestatus/{id}',
    method: 'put',
  }),
};
