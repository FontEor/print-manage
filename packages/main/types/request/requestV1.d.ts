import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ResponseDataGeneral } from '../response';
import {
  AccountListResponse,
  AccountListQueryAxios,
  AccountDetailQueryAxios,
  AccountDetailResponse,
  AccountPostDataAxios,
} from '../apis/account';
import {
  RoleListResponse,
  RoleListQueryAxios,
  RoleInstance,
  RoleDetailResponse,
} from '../apis/role';

import { SourceData, Property } from '../apis/sourceData';
import { SystemData } from '../apis/systemData';
import { OpenTemplateData } from '../apis/openTemplateData';
import { UserData } from '../apis/userData';
import { ElementData } from '../apis/elementData';
import { Standard } from '../apis/standard';
import { Custom } from '../apis/custom';
import { TemplateImages, TemplateReplace } from '../apis/template';

import { Menu } from '../menu';
import { Express } from '../apis/express';
import { JWMS } from '../apis/jwms';
import { WhiteList } from '../apis/examine';
import { Logs } from '../apis/logs';
import { Version } from '../apis/version';
import { PluginForceUpdate, PluginInstall, PluginVersion } from '../apis/plugin';
import { Bluetooth } from '../apis/bluetooth';
import { MessagePush } from '../apis/messagePush';
import { EnumsManage } from '../apis/enumManage';

export interface RequestV1 {
  // [prop: string]: Function | undefined;
  login: (options?: AxiosRequestConfig) => Promise<AxiosResponse<ResponseDataGeneral>>;
  menuGet: (options?: AxiosRequestConfig) => Promise<Menu.ListResponse>;
  accountList: (options?: AccountListQueryAxios) => Promise<AxiosResponse<AccountListResponse>>;
  accountDetail: (
    options?: AccountDetailQueryAxios,
  ) => Promise<AxiosResponse<AccountDetailResponse>>;
  accountAdd: (options?: AccountPostDataAxios) => Promise<AxiosResponse<ResponseDataGeneral>>;

  roleList: (options?: RoleListQueryAxios) => Promise<AxiosResponse<RoleListResponse>>;
  roleAll: (options?: AxiosRequestConfig) => Promise<AxiosResponse<RoleInstance[]>>;
  roleDetail: (options?: RoleListQueryAxios) => Promise<AxiosResponse<RoleDetailResponse>>;
  roleDelete: (Options?: RoleListQueryAxios) => Promise<AxiosResponse<RoleDetailResponse>>;
  // 由拦截器处理 AxiosResponse 转换为 具体Data 所以去掉 AxiosResponse 伪类
  // 数据源处理部分
  sourceList: (
    options: SourceData.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<SourceData.ListResponse>;
  sourceCreate: (
    options: SourceData.CreateAxios & AxiosRequestConfig,
  ) => Promise<SourceData.CreateResponse>;
  sourceDetail: (
    options: SourceData.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<SourceData.DetailResponse>;
  sourceUpdate: (
    options: SourceData.ChangeAxios & AxiosRequestConfig,
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
    options: Property.ChangeDataAxios & AxiosRequestConfig,
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
  // 系统相关接口
  systemNoPageList: (
    options: SystemData.ListNoPageAxios & AxiosRequestConfig,
  ) => Promise<SystemData.ListResponse>;
  systemList: (
    options: SystemData.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<SystemData.ListResponse>;
  systemCreate: (
    options: SystemData.CreateAxios & AxiosRequestConfig,
  ) => Promise<SystemData.CreateResponse>;
  systemDetail: (
    options: SystemData.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<SystemData.DetailResponse>;
  systemUpdate: (
    options: SystemData.UpdateAxios & AxiosRequestConfig,
  ) => Promise<SystemData.UpdateResponse>;
  systemDelete: (
    options: SystemData.DeleteAxios & AxiosRequestConfig,
  ) => Promise<SystemData.DeleteResponse>;
  // 自定义模板相关接口
  openTemplateList: (
    options: OpenTemplateData.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.ListResponse>;
  openTemplateCreate: (
    options: OpenTemplateData.CreateAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.CreateResponse>;
  openTemplateDetail: (
    options: OpenTemplateData.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.DetailResponse>;
  openTemplateUpdate: (
    options: OpenTemplateData.UpdateAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.UpdateResponse>;
  openTemplateDelete: (
    options: OpenTemplateData.DeleteAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.DeleteResponse>;
  // 此接口已经不满足业务需要
  tempSpecifsList: (
    options: OpenTemplateData.TempSpecifsListAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.TempSpecifsResponse>;
  deliveryList: (
    options: OpenTemplateData.DeliveryListAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.DeliveryListResponse>;
  // 模板接口
  templateImageList: (
    options: TemplateImages.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<TemplateImages.ListResponse>;
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
  // 要素相关接口
  elementList: (
    options: ElementData.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<ElementData.ListResponse>;
  elementCreate: (
    options: ElementData.CreateAxios & AxiosRequestConfig,
  ) => Promise<ElementData.CreateResponse>;
  elementDetail: (
    options: ElementData.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<ElementData.DetailResponse>;
  elementUpdate: (
    options: ElementData.UpdateAxios & AxiosRequestConfig,
  ) => Promise<ElementData.UpdateResponse>;
  elementDelete: (
    options: ElementData.DeleteAxios & AxiosRequestConfig,
  ) => Promise<ElementData.DeleteResponse>;
  systemSourcePropertyList: (
    options: ElementData.SystemSourcePropertyAxios & AxiosRequestConfig,
  ) => Promise<ElementData.SystemSourcePropertyResponse>;
  uploadImage: (
    options: ElementData.UploadImageAxios & AxiosRequestConfig,
  ) => Promise<ElementData.UploadImageResponse>;
  // 用户相关
  getUserInfo: (options: UserData.UserAxios & AxiosRequestConfig) => Promise<UserData.UserResponse>;
  loadImg: (
    options: OpenTemplateData.loadImgAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.loadImgResponse>;
  menusList: (options: AxiosRequestConfig) => Promise<UserData.MenuResponse>;
  // ERP相关
  userErpInfo: (
    options: UserData.ErpPinQueryAxios & AxiosRequestConfig,
  ) => Promise<UserData.ErpPinQueryResponse>;
  logout: () => Promise<null>;
  // PIN相关
  userPinInfo: (
    options: UserData.UserPinQueryAxios & AxiosRequestConfig,
  ) => Promise<UserData.UserPinQueryResponse>;
  userPinIsBPin: (
    options: UserData.UserPinQueryAxios & AxiosRequestConfig,
  ) => Promise<UserData.UserPinIsBPinResponse>;

  userPinProxy: (
    options: UserData.ErpPinQueryAxios & AxiosRequestConfig,
  ) => Promise<UserData.UserAndErpResponse>;
  // 标准模板相关

  userTemplateList: (
    options: Standard.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<Standard.ListResponse>;
  userTemplateCreate: (
    options: Standard.CreateUserTemplateRelationAxios & AxiosRequestConfig,
  ) => Promise<Standard.CreateResponse>;
  // 自定义区相关
  customList: (options: Custom.ListQueryAxios & AxiosRequestConfig) => Promise<Custom.ListResponse>;
  customDetail: (
    options: Custom.DetailQueryAxios & AxiosRequestConfig,
  ) => Promise<Custom.DetailResponse>;
  customUpdate: (
    options: Custom.ChangeDataAxios & AxiosRequestConfig,
  ) => Promise<Custom.ChangeResponse>;
  customDelete: (
    options: Custom.DeleteAxios & AxiosRequestConfig,
  ) => Promise<Custom.DeleteResponse>;

  // 承运商接口相关
  expressList: (
    options: Express.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<Express.ListResponse>;
  expressCreate: (
    options: Express.CreateAxios & AxiosRequestConfig,
  ) => Promise<Express.CreateResponse>;
  expressUpdate: (
    options: Express.CreateAxios & AxiosRequestConfig,
  ) => Promise<Express.CreateResponse>;
  expressDelete: (
    options: Express.DeleteAxios & AxiosRequestConfig,
  ) => Promise<Express.DeleteResponse>;
  expressDetail: (
    options: Express.DetailAxios & AxiosRequestConfig,
  ) => Promise<Express.DetailResponse>;
  expressUploadLogo: (
    options: Express.UploadLogoAxios & AxiosRequestConfig,
  ) => Promise<Express.UploadLogoResponse>;
  expressRelationList: (
    options: Express.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<Express.ListRelationResponse>;
  expressRelation: (
    options: Express.RelationAxios & AxiosRequestConfig,
  ) => Promise<Express.RelationResponse>;

  // // 业务类型接口
  // businessList: (options: Business.ListQueryAxios & AxiosRequestConfig) => Promise<Business.ListResponse>;
  // businessCreate: (options: Business.CreateAxios & AxiosRequestConfig) => Promise<Business.CreateResponse>;
  // businessUpdate: (options: Business.UpdateAxios & AxiosRequestConfig) => Promise<Business.UpdateResponse>;
  // businessDelete: (options: Business.DeleteAxios & AxiosRequestConfig) => Promise<Business.DeleteResponse>;
  // businessDetail: (options: Business.DetailQueryAxios & AxiosRequestConfig) => Promise<Business.DetailResponse>;
  // businessParentsList: (options: Business.ParentsListQueryAxios & AxiosRequestConfig) => Promise<Business.ListResponse>;
  // 仅仅与 JWMS 相关的接口
  jwmsCreateCustom: (
    options: JWMS.CustomCreateAxios & AxiosRequestConfig,
  ) => Promise<JWMS.CustomCreateResponse>;
  jwmsCreateTemplate: (
    options: JWMS.TemplateCreateAxios & AxiosRequestConfig,
  ) => Promise<JWMS.TemplateCreateResponse>;
  jwmsTransfromTemplate: (
    options: JWMS.TransfromAxios & AxiosRequestConfig,
  ) => Promise<JWMS.TransfromResponse>;
  jwmsTransfromSave: (
    options: JWMS.TransformSaveAxios & AxiosRequestConfig,
  ) => Promise<JWMS.TransformSaveResponse>;
  // 白名单
  whiteLists: (
    options: WhiteList.Instance & AxiosRequestConfig,
  ) => Promise<WhiteList.commomResponse>;
  whiteListsReview: (
    options: WhiteList.ReviewAxios & AxiosRequestConfig,
  ) => Promise<WhiteList.commomResponse>;
  whiteListsQueryIsvReview: (
    options: WhiteList.queryReviewAxios & AxiosRequestConfig,
  ) => Promise<WhiteList.IsvResponse>;
  whiteListsQueryMerchantReview: (
    options: WhiteList.queryReviewAxios & AxiosRequestConfig,
  ) => Promise<WhiteList.merchantResponse>;
  whiteListsDownloadPdf: (
    options: OpenTemplateData.loadImgAxios & AxiosRequestConfig,
  ) => Promise<OpenTemplateData.loadImgResponse>;
  // 插件相关接口
  pluginInstallList: (
    options: PluginInstall.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<PluginInstall.ListResponse>;
  pluginVersionList: (
    options: PluginVersion.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.ListResponse>;
  pluginVersionCreate: (
    options: PluginVersion.CreateAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.CreateResponse>;
  pluginVersionUpDown: (
    options: PluginVersion.UpDownAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.UpDownResponse>;
  pluginVersionPush: (
    options: PluginVersion.PushAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.PushResponse>;
  pluginVersionCurrentGet: (
    options: PluginVersion.GetCurrentVersionAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.GetCurrentVersionResponse>;
  pluginVersionDetail: (
    options: PluginVersion.DetailAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.DetailResponse>;
  pluginVersionUpdate: (
    options: PluginVersion.UpdateAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.UpdateResponse>;
  pluginVersionDelete: (
    options: PluginVersion.DeleteAxios & AxiosRequestConfig,
  ) => Promise<PluginVersion.DeleteResponse>;
  // 强制升级
  pluginForceList: (
    options: PluginForceUpdate.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<PluginForceUpdate.ListQueryResponse>;
  pluginStartUpgrade: (
    options: PluginForceUpdate.StartForceUpgradeAxios & AxiosRequestConfig,
  ) => Promise<PluginForceUpdate.StartForceUpgradeResponse>;
  pluginPauseUpgrade: (
    options: PluginForceUpdate.PauseUpgradeAxios & AxiosRequestConfig,
  ) => Promise<PluginForceUpdate.PauseUpgradeResponse>;
  pluginResumeUpgrade: (
    options: PluginForceUpdate.ResumeUpgradeAxios & AxiosRequestConfig,
  ) => Promise<PluginForceUpdate.ResumeUpgradeResponse>;
  pluginImportPins: (
    options: PluginForceUpdate.ImportPinsAxios & AxiosRequestConfig,
  ) => Promise<PluginForceUpdate.ImportPinsResponse>;
  pluginSetSuccessPercentage: (
    options: PluginForceUpdate.SetSuccessPercentageAxios & AxiosRequestConfig,
  ) => Promise<PluginForceUpdate.SetSucessPercentageResponse>;
  // 日志相关接口
  logsList: (options: Logs.ListQueryAxios & AxiosRequestConfig) => Promise<Logs.ListResponse>;
  logPreview: (
    options: Logs.PreviewDataAxios & AxiosRequestConfig,
  ) => Promise<Logs.PreviewResponse>;
  // 下载模板记录 不影响主流程
  logTemplateDownload: (
    options: Logs.DownloadProxyAxios & AxiosRequestConfig,
  ) => Promise<Logs.DownloadProxyResponse>;
  // 模板替换
  templateReplaceList: (
    options: TemplateReplace.ListQueryAxios & AxiosRequestConfig,
  ) => Promise<TemplateReplace.ListQueryResponse>;
  templateReplaceCreate: (
    options: TemplateReplace.CreateAxios & AxiosRequestConfig,
  ) => Promise<TemplateReplace.CreateResponse>;
  templateReplaceUpdate: (
    options: TemplateReplace.ChangeAxios & AxiosRequestConfig,
  ) => Promise<TemplateReplace.ChangeResponse>;
  templateReplaceDelete: (
    options: TemplateReplace.DeleteAxios & AxiosRequestConfig,
  ) => Promise<TemplateReplace.DeleteResponse>;
  templateReplaceStandardList: (
    options: TemplateReplace.StandardListAxios & AxiosRequestConfig,
  ) => Promise<TemplateReplace.StandardListResponse>;
  // 蓝牙设备相关
  bluetoothPrintType: (
    options: Bluetooth.PrintTypeAxios & AxiosRequestConfig,
  ) => Promise<Bluetooth.PrintTypeResponse>;
  bluetoothList: (
    options: Bluetooth.ListAxios & AxiosRequestConfig,
  ) => Promise<Bluetooth.ListResponse>;
  bluetoothCreate: (
    options: Bluetooth.CreateAxios & AxiosRequestConfig,
  ) => Promise<Bluetooth.CreateResponse>;
  bluetoothUpdate: (
    options: Bluetooth.UpdateAxios & AxiosRequestConfig,
  ) => Promise<Bluetooth.UpdateAxios>;
  bluetoothDelete: (
    options: Bluetooth.DeleteAxios & AxiosRequestConfig,
  ) => Promise<Bluetooth.DeleteResponse>;
  bluetoothDetail: (
    options: Bluetooth.DetailAxios & AxiosRequestConfig,
  ) => Promise<Bluetooth.DetailResponse>;
  // 消息推送相关
  messagePushList: (
    options: MessagePush.ListAxios & AxiosRequestConfig,
  ) => Promise<MessagePush.ListResponse>;
  messagePushCreate: (
    options: MessagePush.CreateAxios & AxiosRequestConfig,
  ) => Promise<MessagePush.CreateResponse>;
  messagePushUpdate: (
    options: MessagePush.UpdateAxios & AxiosRequestConfig,
  ) => Promise<MessagePush.UpdateAxios>;
  messagePushDetail: (
    options: MessagePush.DetailAxios & AxiosRequestConfig,
  ) => Promise<MessagePush.DetailResponse>;
  messagePushExamine: (
    options: MessagePush.ExamineAxios & AxiosRequestConfig,
  ) => Promise<MessagePush.DetailResponse>;
  // 枚举管理相关
  enumList: (
    options: EnumsManage.ListAxios & AxiosRequestConfig,
  ) => Promise<EnumsManage.ListResponse>;
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
}

// 请求分页数据结构
export interface RequestForPage {
  from?: number;
  size?: number;
}
