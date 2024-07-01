import { groupBy, keys, get, map } from 'lodash';

import type { openTemplateData } from '@/types/apis/openTemplateData';
import { SystemData } from '@/types/apis/systemData';
import { requestV1, requestV2 } from '@/axios/request';
import { TemplateImages } from '@/types/apis/template';
import { elementTypeEnum } from '@/enums/element';
import { runStateEnum } from '@/enums/runState';
import { upgradeStateEnum } from '@/enums/upgrade';
import { upDownEnum } from '@/enums/upDown';
import { SourceData } from '@/types/apis/sourceData';
import { Standard } from '@/types/apis/standard';
import { Bluetooth } from '@/types/apis/bluetooth';
import { ENUMS } from '@/types/enums';
import { EnumsManage } from '@/types/apis/enumManage';
import { SystemList } from '@/types/apis/join-system';
import { Session } from '@/utils/session';
import { TemplateCategory } from '@/types/apis/template-category';
import { TemplateTag } from '@/types/apis/template-tag';
import { AdvertisingPlan } from '@/types/apis/advertising-plan';
import { Express } from '@/types/apis/express';
import { General } from '@/types/general';

interface objectType {
  [key: string]: number | string;
}

interface SelectState {
  // /orgs/tempOrgs
  // standardOptions?: TemplateImages.Instance[]; // 可用的标准模板列表
  standardOptions?: Standard.Instance[]; // 可用的标准模板列表
  orgOptions?: SystemData.Instance[]; //系统类型
  orgNewOptions?: SystemList.Instance[]; //新-系统类型
  specifIdOptions?: openTemplateData.Instance[]; //面单类型
  deliveryCodeOptions?: openTemplateData.Instance[]; //承运商
  sourceOptions?: SourceData.Instance[]; // 数据源
  printTypes?: Bluetooth.PrintType[]; // 打印方式
  printTypeTree?: ENUMS.LEVEL[]; // 打印方式
  enumsList?: EnumsManage.Instance[]; // 枚举列表
  categoryList?: TemplateCategory.Instance[]; // 模板分类列表
  tagList?: String[] | TemplateTag.Instance[]; // 模板标签
  adChannelList?: AdvertisingPlan.ChannelInstance[]; // 广告投放渠道
  expressList?: Express.Instance[]; // 广告承运商
  adCityList?: AdvertisingPlan.CityTree[]; // 广告投放城市
  [key: string]: any;
}

export default function (state: SelectState) {
  // 获取选择系统下拉框
  const getOrgList = async () => {
    const params = {
      isPage: 0,
    };
    const response = await requestV1.systemNoPageList({ params });
    const { data } = response;
    state.orgOptions = data;
    return Promise.resolve(data);
  };

  // 获取(新)选择系统下拉框
  const getOrgListNew = async () => {
    const response = await requestV2.userOwnedSystemList({});
    const { data } = response;
    state.orgNewOptions = data;
    return Promise.resolve(data);
  };

  // 获取面单类型下拉框
  const getTempSpecifsList = async () => {
    const params = { isPage: 0 };
    const response = await requestV1.tempSpecifsList({ params });
    state.specifIdOptions = response.data;
  };

  // 获取承运商下拉框
  const getDeliveryList = async () => {
    const params = { isPage: 0 };
    const response = await requestV1.deliveryList({ params });
    state.deliveryCodeOptions = response.data;
  };

  // 数据源列表数据
  const getSourceList = async (orgId?: number) => {
    const params = { isPage: 0, nameOrCode: '', id: orgId };
    const response = await requestV1.sourceList({ params });
    state.sourceOptions = response.data;
  };

  // 数据源列表枚举值转换
  const formatSourceId = (sourceId: string | number) => {
    const sourceIdEnum: objectType = {};
    (state.sourceOptions || []).forEach((item) => {
      const label = item.name;
      const value = item.id;
      sourceIdEnum[value] = label;
    });
    return sourceIdEnum[sourceId];
  };

  // 面单类型枚举值转换
  const formatSpecifId = (specifId: string | number) => {
    const specifIdEnum: objectType = {};
    (state.specifIdOptions || []).forEach((item) => {
      const label = item.name;
      const value = item.id;
      specifIdEnum[value] = label;
    });
    return specifIdEnum[specifId];
  };

  // 承运商类型转换
  const formatDeliveryCode = (deliveryCode: string) => {
    const deliveryCodeEnum: objectType = {};
    (state.deliveryCodeOptions || []).forEach((item) => {
      const label = item.name;
      const value = item.code;
      deliveryCodeEnum[value] = label;
    });
    return deliveryCodeEnum[deliveryCode] || deliveryCode;
  };
  // 标准模板列表接口
  const getStandardList = async (
    params: TemplateImages.ListQueryAxios,
    formatFn?: (data: TemplateImages.Instance[]) => TemplateImages.Instance[],
  ) => {
    params.params.isPage = 0;
    const response = await requestV1.templateImageList(params);
    if (formatFn) {
      state.standardList = formatFn(response.data);
      return;
    }
    state.standardList = response.data;
  };
  const getUserStandardList = async () => {
    // const response = await requestV1.templateImageList({
    const response = await requestV1.userTemplateList({
      params: {
        deliveryCode: '',
        hasCustom: '1',
        orgId: '',
        tempCode: '',
        isPage: 0,
        // codeOrName: "", // 名称或编码
        // deliveryCode: "", // 承运商编码
        // hasCustom: 1, // 是否包含自定义区
        // isIssUed: 1, // 是否发布
        // isPage: 0, // 是否分页
        // needImage: 0, // 是否需要查询coverImage
      },
    });
    state.standardOptions = response.data;
  };

  // 获取打印方式
  const getPrintType = async (isTree = false) => {
    const response = await requestV1.bluetoothPrintType({});
    state.printTypes = response.list;
    if (isTree) {
      state.printTypeTree = formatPrintTypeToTree(response.list);
    }
  };

  // 获取枚举项列表
  const getEnumsList = async (nameOrCode = '') => {
    const response = await requestV1.enumList({
      params: {
        nameOrCode: nameOrCode,
        isPage: 0,
        orgId: Session.getOrgId() as number,
      },
    });
    state.enumsList = response.data || [];
  };

  // 获取模板分类列表
  const getCategoryList = () => {
    requestV2.categoryList().then((response: TemplateCategory.Instance[]) => {
      state.categoryList = response;
    });
  };

  // 获取当前系统标签列表
  const getCurrentSystemTagList = () => {
    const params = {
      replacements: {
        orgId: `${Session.getOrgId()}`,
      },
    };
    requestV2.tagListOfCurrentSystem(params).then((response) => {
      state.tagList = response.data;
    });
  };
  // 获取模板市场标签列表
  const getAllSystemTagList = () => {
    const params = {
      replacements: {
        orgId: `${Session.getOrgId()}`,
      },
    };
    requestV2.tagListOfAllSystem(params).then((response) => {
      state.tagList = response.data;
    });
  };
  // 获取模板列表标签
  const getTempListAndRelationTemplateTagList = () => {
    const params = {
      replacements: {
        orgId: `${Session.getOrgId()}`,
      },
    };
    requestV2.tagListOfTempListAndRelationTemplate(params).then((response) => {
      state.tagList = response.data;
    });
  };

  const formatPrintTypeToTree = (list: Bluetooth.PrintType[]): ENUMS.LEVEL[] => {
    const group = groupBy(list, 'category');
    const result: ENUMS.LEVEL[] = [];
    keys(group).map((key) => {
      const values: Bluetooth.PrintType[] = group[key] || [];
      const category = get(values, '[0].category', '');
      const categoryName = get(values, '[0].categoryName', '');
      if (category) {
        result.push({
          label: categoryName,
          value: category,
          children: map(values, (type: Bluetooth.PrintType) => {
            return {
              label: type.name,
              value: type.code,
            };
          }),
        });
      }
    });
    return result;
  };

  // 系统类型转换
  const formatOrgId = (orgId: number) => {
    const orgIdEnum: objectType = {};
    (state.orgOptions || []).forEach((item) => {
      const label = item.name;
      const value = item.id;
      orgIdEnum[value] = label;
    });
    return orgIdEnum[orgId];
  };

  // 是否自定义转换
  const formatHasCustom = (hasCustom: number) => {
    const hasCustomMap = ['否', '是'];
    return hasCustomMap[hasCustom];
  };

  // 要素类型转换
  const formatElementType = (elementType: string) => {
    return elementTypeEnum[elementType];
  };

  // 运行状态转换
  const formatRunState = (runState: string) => {
    return runStateEnum[runState];
  };

  // 升级状态转换
  const formatUpgradeState = (state: string) => {
    return upgradeStateEnum[state];
  };

  // 上下架状态
  const formatUpDownState = (state: string) => {
    return upDownEnum[state];
  };

  const getAdChannelList = async () => {
    const response = await requestV2.adPrintChannelList({});
    state.adChannelList = response.data;
  };

  const getExpressList = async () => {
    const response = await requestV1.expressList({
      params: {
        isPage: 0,
        nameOrCode: '',
      },
      replacements: {
        orgId: '',
      },
    });
    state.expressList = response.data;
  };

  const getAdCityList = async () => {
    const response = await requestV2.adCityList({});
    state.adCityList = response.data;
  };

  return {
    getOrgList,
    getOrgListNew,
    getTempSpecifsList,
    getDeliveryList,
    getSourceList,
    formatSourceId,
    formatSpecifId,
    formatDeliveryCode,
    getStandardList,
    formatOrgId,
    formatHasCustom,
    formatElementType,
    getUserStandardList,
    formatRunState,
    formatUpgradeState,
    formatUpDownState,
    getPrintType,
    formatPrintTypeToTree,
    getEnumsList,
    getCategoryList,
    getCurrentSystemTagList,
    getAllSystemTagList,
    getTempListAndRelationTemplateTagList,
    getExpressList,
    getAdChannelList,
    getAdCityList,
  };
}
