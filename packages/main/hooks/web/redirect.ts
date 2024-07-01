import axios from 'axios';
import { TemplateNew } from '@/types/apis/template-new';
import { TemplateMarket } from '@/types/apis/template-market';
import { VersionManage } from '@/types/apis/version-manage';
interface RedirectParams {
  tempType: number | string;
  orgId: number | string;
  temId: number | string;
  sourceId?: number | string;
  verId?: number | string;
  cid?: number | string;
  templateCode?: number | string;
  k?: string;
  i?: string;
  s?: string; // J W M S 专用
}

export const redirectTemplateEditor = (detail: TemplateNew.ListInstance, verId?: number) => {
  const params: RedirectParams = {
    tempType: 1,
    orgId: detail.orgId,
    temId: detail.id,
    sourceId: detail.sourceId,
    verId: detail.currentDefaultVer || verId || undefined,
    cid: undefined,
    templateCode: detail.code,
  };
  const url = axios.getUri({
    url: `${import.meta.env.VITE_APP_EDITOR_PREFIX}`,
    params,
  });
  window.open(url, '_blank');
};

export const redirectCustomEditor = (instance: TemplateMarket.StateDetailCustom) => {
  const params: RedirectParams = {
    tempType: 2,
    orgId: instance?.orgId,
    temId: instance?.parentTemplateId,
    sourceId: instance?.sourceId || undefined,
    verId: instance?.verId,
    cid: instance?.areaId,
    templateCode: instance?.parentTemplateCode,
  };
  const url = axios.getUri({
    url: `${import.meta.env.VITE_APP_EDITOR_PREFIX}`,
    params,
  });
  window.open(url, '_blank');
};

export const redirectTemplateVersion = (version: VersionManage.Instance) => {
  const params: RedirectParams = {
    tempType: 1,
    orgId: version.orgId,
    temId: version.templateId,
    sourceId: version.sourceId || '',
    verId: version.id || undefined,
    cid: undefined,
    templateCode: version.templateCode,
  };
  const url = axios.getUri({
    url: `${import.meta.env.VITE_APP_EDITOR_PREFIX}`,
    params,
  });
  window.open(url, '_blank');
};

export const redirectCustomVersion = (version: VersionManage.Instance) => {
  const params: RedirectParams = {
    tempType: 2, // 自定义区 写死2
    orgId: version.orgId, // 自定义区域系统ID
    sourceId: version.sourceId || '', // 自定义区数据源
    verId: version.id || undefined, // 自定义区版本ID
    cid: version.templateId, // 自定义区模板ID
    temId: version.parentTemplateId as number, // 自定义区域 父模板ID
    templateCode: version.parentTemplateCode, // 父模板CODE
  };
  const url = axios.getUri({
    url: `${import.meta.env.VITE_APP_EDITOR_PREFIX}`,
    params,
  });
  window.open(url, '_blank');
};
