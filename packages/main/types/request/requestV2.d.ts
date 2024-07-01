import { AxiosRequestConfig } from 'axios';
import { ResponseDataGeneral } from '../response';
import { MenuPermission } from '../apis/menu';
import { TemplateNew } from '@/types/apis/template-new';
import { TemplateCategory } from '@/types/apis/template-category';
import { TemplateTag } from '@/types/apis/template-tag';
import { OpenTemplateData } from '@/types/apis/openTemplateData';
import { Version } from '@/types/apis/version';
import { TemplateMarket } from '@types/apis/template-market.d';
import { SourceNew, EnmusProperty, SourcePropertyNew } from '@/types/apis/source-new.d';
import { Property, SourceData } from '@/types/apis/sourceData';
import { EnumsManage } from '@/types/apis/enumManage';
import { SystemData } from '@/types/apis/systemData';
import { JoinSystem, Register, SystemList } from '@/types/apis/join-system';

import { AdvertisingPlan } from '@/types/apis/advertising-plan';
import { Express } from '@/types/apis/express';
import type { UserData } from '@/types/apis/userData';
import type { SystemAdministration } from '@/types/apis/system-administration';
import {
  WaybillTemplateReview,
} from '@/types/apis/waybill-template-review';
import { BusinessTemplateConfig } from '@/types/apis/business-template-config';
import { TemplateClassification } from '@/types/apis/template-classification';
import {GrayUpgradeStrategy} from "@/types/apis/gray-upgrade-strategy";

export interface RequestV2 {
  menusList: (options: AxiosRequestConfig) => Promise<Menu.ListResponse>;
  // 系统相关接口
  systemNoPageList: (
    options: SystemData.ListNoPageAxios & AxiosRequestConfig,
  ) => Promise<SystemData.ListResponse>;
  userOwnedSystemList: (options: AxiosRequestConfig) => Promise<SystemList.ListResponse>;
  // 菜单权限相关
  menuList: (
    options: MenuPermission.MenuQueryAxios & AxiosRequestConfig,
  ) => Promise<MenuPermission.MenuListResponse>;
  menuAllList: (
    options: MenuPermission.MenuQueryAxios & AxiosRequestConfig,
  ) => Promise<MenuPermission.MenuListResponse>;
  // 申请系统相关
  ableToJoinSystem: (options: AxiosRequestConfig) => Promise<Register.RegisterResponse>;
  applySystemList: (
    options: JoinSystem.ListAxios & AxiosRequestConfig,
  ) => Promise<JoinSystem.ListResponse>;
  applyToJoinSystem: (
    options: JoinSystem.ApplyToJoinSystemQuery & AxiosRequestConfig,
  ) => Promise<ResponseDataGeneral>;
  // 创建系统相关
  systemList: (
    options: SystemAdministration.ListQuery & AxiosRequestConfig,
  ) => Promise<SystemAdministration.ListResponse>;
  systemCreate: (
    options: SystemAdministration.CreateAxios & AxiosRequestConfig,
  ) => Promise<SystemData.CreateResponse>;
  systemDetail: (
    options: SystemData.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<SystemAdministration.DetailResponse>;
  systemUpdate: (
    options: SystemAdministration.UpdateAxios & AxiosRequestConfig,
  ) => Promise<SystemData.UpdateResponse>;
  // ERP相关
  userErpInfo: (
    options: UserData.ErpPinQueryAxios & AxiosRequestConfig,
  ) => Promise<UserData.ErpPinQueryResponse>;
  // 模板分类列表
  categoryList: () => Promise<TemplateCategory.Instance[]>;
  templateClassifyListPageList: (
    options: TemplateClassification.ListAxios,
  ) => Promise<TemplateCategory.ListResponse>;
  templateClassifyCreate: (
    options: TemplateClassification.CreateAxios,
  ) => Promise<TemplateCategory.CreateResponse>;
  templateClassifyUpdate: (
    options: TemplateClassification.UpdateAxios,
  ) => Promise<TemplateCategory.UpdateResponse>;
  templateClassifyDelete: (
    options: TemplateClassification.DeleteAxios,
  ) => Promise<TemplateCategory.DeleteResponse>;
  templateClassifyDetail: (
    options: TemplateClassification.DetailAxios,
  ) => Promise<TemplateCategory.DetailResponse>;

  tagListOfCurrentSystem: (options: TemplateTag.ListAxios) => Promise<TemplateTag.ListResponse>;
  tagListOfAllSystem: (options: TemplateTag.ListAxios) => Promise<TemplateTag.ListResponseOfOther>;
  tagListOfTempListAndRelationTemplate: (
    options: TemplateTag.ListAxios,
  ) => Promise<TemplateTag.ListResponseOfOther>;
  tagCreate: (options: TemplateTag.CreateAxios) => Promise<TemplateTag.CreateResponse>;
  tagUpdate: (options: TemplateTag.UpdateAxios) => Promise<TemplateTag.UpdateResponse>;
  tagDelete: (options: TemplateTag.DeleteAxios) => Promise<TemplateTag.DeleteResponse>;
  templateCreate: (
    options: TemplateNew.CreateAxios & AxiosRequestConfig,
  ) => Promise<TemplateNew.CreateResponse>;
  templateUpdate: (
    options: TemplateNew.UpdateAxios & AxiosRequestConfig,
  ) => Promise<TemplateNew.UpdateResponse>;
  templateList: (options: TemplateNew.ListWebAxios) => Promise<TemplateNew.ListResponse>;
  templatePublish: (options: TemplateNew.PublishTemplateAxios) => Promise<ResponseDataGeneral>;
  templateShare: (options: TemplateNew.ShareAxios) => Promise<ResponseDataGeneral>;
  templateCancelShare: (options: TemplateNew.ShareAxios) => Promise<ResponseDataGeneral>;
  templateMarketList: (
    options: TemplateMarket.TemplateMarketQueryAxios & AxiosRequestConfig,
  ) => Promise<ResponseDataForPage>;
  // 直接添加至列表
  templateAddToList: (
    options: TemplateMarket.AddToTemplateList,
  ) => Promise<TemplateNew.CreateResponse>;
  // 绘制自定义区
  templateAddCustonToList: (
    options: Standard.CreateUserTemplateRelationAxios & AxiosRequestConfig,
  ) => Promise<TemplateMarket.ListInstance>;
  // 绘制整个模板
  templateAddAllCustonToList: (
    options: Standard.CreateUserTemplateRelationAxios & AxiosRequestConfig,
  ) => Promise<TemplateMarket.ListInstance>;
  templateDetail: (options: TemplateNew.DetailAxios) => Promise<TemplateNew.DetailResponse>;
  // 版本相关接口
  versionList: (
    options: OpenTemplateData.VersionListAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.VersionListResponse>;
  versionPublish: (
    options: OpenTemplateData.PublishVersionAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.PublishVersionResponse>;
  versionDelete: (
    options: OpenTemplateData.DeleteVersionAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.DeleteVersionResponse>;
  versionSetDefault: (
    options: Version.SetDefaultAxios & AxiosRequestConfig,
  ) => Promise<Version.SetDefaultResponse>;
  sourceList: (
    options: SourceData.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<SourceData.ListResponse>;
  sourceCreate: (
    options: SourceNew.CreateAxios & AxiosRequestConfig,
  ) => Promise<SourceData.CreateResponse>;
  sourceDetail: (
    options: SourceData.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<SourceData.DetailResponse>;
  sourceUpdate: (
    options: SourceNew.ChangeDataAxios & AxiosRequestConfig,
  ) => Promise<SourceData.ChangeResponse>;
  sourceDelete: (
    options: SourceData.DeleteAxios & AxiosRequestConfig,
  ) => Promise<SourceData.DeleteResponse>;
  // 属性相关接口
  propertyList: (
    options: Property.ListAxios & AxiosRequestConfig,
  ) => Promise<Property.ListResponse>;
  propertyCreate: (
    options: Property.CreateDataAxios & AxiosRequestConfig,
  ) => Promise<Property.CreateResponse>;
  propertyDetail: (
    options: Property.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<Property.DetailResponse>;
  propertyUpdate: (
    options: SourcePropertyNew.ChangeDataAxios & AxiosRequestConfig,
  ) => Promise<Property.ChangeResponse>;
  propertyDelete: (
    options: Property.DeleteAxios & AxiosRequestConfig,
  ) => Promise<Property.DeleteResponse>;
  propertyImport: (
    options: Property.ImportAxios & AxiosRequestConfig,
  ) => Promise<Property.ImportResponse>;
  propertyRelationEnum: (
    options: Property.RelationEnumAxios & AxiosRequestConfig,
  ) => Promise<Property.RelationEnumResponse>;
  // 枚举管理相关
  enumList: (
    options: EnumsManage.ListAxios & AxiosRequestConfig,
  ) => Promise<EnmusProperty.ListResponse>;
  enumImport: (
    options: EnumsManage.ImportAxios & AxiosRequestConfig,
  ) => Promise<EnumsManage.ImportAxios>;
  enumUpdate: (
    options: EnumsManage.UpdateAxios & AxiosRequestConfig,
  ) => Promise<EnumsManage.UpdateAxios>;
  enumDelete: (
    options: EnumsManage.DeleteAxios & AxiosRequestConfig,
  ) => Promise<EnumsManage.DeleteResponse>;
  enumDetail: (
    options: EnumsManage.DetailAxios & AxiosRequestConfig,
  ) => Promise<EnumsManage.DetailResponse>;
  // 广告相关接口
  adPrintChannelList: (options: AxiosRequestConfig) => Promise<AdvertisingPlan.ChannelResponse>;
  adCityList: (options: AxiosRequestConfig) => Promise<AdvertisingPlan.CitiesResponse>;
  adWhiteListDetail: (
    options: AxiosRequestConfig,
  ) => Promise<AdvertisingPlan.WhiteListDetailResponse>;
  adWhiteListUpdate: (
    options: AdvertisingPlan.WhiteListUpdateAxios & AxiosRequestConfig,
  ) => Promise<AdvertisingPlan.WhiteListUpdateResponse>;
  adList: (
    options: AdvertisingPlan.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<AdvertisingPlan.ListResponse>;
  adCreate: (
    options: AdvertisingPlan.CreateAxios & AxiosRequestConfig,
  ) => Promise<AdvertisingPlan.CreateResponse>;
  adUpdate: (
    options: AdvertisingPlan.UpdateAxios & AxiosRequestConfig,
  ) => Promise<AdvertisingPlan.UpdateResponse>;
  adDetail: (
    options: AdvertisingPlan.DetailAxios & AxiosRequestConfig,
  ) => Promise<AdvertisingPlan.DetailResponse>;
  // 承运商接口相关
  expressList: (
    options: Express.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<Express.ListResponse>;

  waybillTemplateReviewList: (
    options: WaybillTemplateReview.ListAxios & AxiosRequestConfig,
  ) => Promise<WaybillTemplateReview.ListResponse>;

  waybillTemplateReviewDetail: (
    options: WaybillTemplateReview.DetailAxios & AxiosRequestConfig,
  ) => Promise<WaybillTemplateReview.DetailResponse>;

  businessTemplateConfigList: (
    options: BusinessTemplateConfig.ListAxios & AxiosRequestConfig,
  ) => Promise<BusinessTemplateConfig.ListResponse>;
  businessTemplateConfigDetail: (
    options: BusinessTemplateConfig.DetailAxios & AxiosRequestConfig,
  ) => Promise<BusinessTemplateConfig.DetailResponse>;
  businessTemplateConfigCreate: (
    options: BusinessTemplateConfig.CreateAxios & AxiosRequestConfig,
  ) => Promise<BusinessTemplateConfig.CreateResponse>;
  businessTemplateConfigUpdate: (
    options: BusinessTemplateConfig.UpdateAxios & AxiosRequestConfig,
  ) => Promise<BusinessTemplateConfig.UpdateResponse>;
  businessTemplateConfigDelete: (
    options: BusinessTemplateConfig.DeleteAxios & AxiosRequestConfig,
  ) => Promise<BusinessTemplateConfig.DeleteResponse>;
  businessNameByBusinessCode: (
    options: BusinessTemplateConfig.BusinessNameByCodeAxios & AxiosRequestConfig,
  ) => Promise<BusinessTemplateConfig.BusinessNameByCodeResponse>;
  businessGetTemplateByCode: (
    options: BusinessTemplateConfig.GetTemplateByCodeAxios & AxiosRequestConfig,
  ) => Promise<BusinessTemplateConfig.GetTemplateByCodeResponse>;
  grayUpgradeList: (
    options: GrayUpgradeStrategy.ListAxios & AxiosRequestConfig,
  ) => Promise<GrayUpgradeStrategy.ListResponse>;
  grayUpgradeCreate: (
    options: GrayUpgradeStrategy.CreateAxios & AxiosRequestConfig,
  ) => Promise<GrayUpgradeStrategy.CreateResponse>;
  grayUpgradeDetail: (
    options: GrayUpgradeStrategy.DetailAxios & AxiosRequestConfig,
  ) => Promise<GrayUpgradeStrategy.DetailResponse>;
  grayUpgradeClose: (
    options: GrayUpgradeStrategy.CloseAxios & AxiosRequestConfig,
  ) => Promise<GrayUpgradeStrategy.CloseResponse>;
}
