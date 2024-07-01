import { VersionManage } from '@/types/apis/version-manage';
import { requestV2 } from '@/axios/request';
import { ElMessage } from 'element-plus';
import { Version } from '@/types/apis/version';
import { redirectTemplateVersion, redirectCustomVersion } from '@/hooks/web/redirect';

export const onDelete = (data: VersionManage.Instance) => {
  return requestV2
    .versionDelete({
      replacements: {
        id: data.orgId,
        verId: data.id,
        temId: data.templateId, //模板id
      },
      data: {
        force: 1,
        tempType: 1,
      },
    })
    .then(() => {
      ElMessage.success('删除成功');
    });
};
export const onSetDefault = (data: VersionManage.Instance) => {
  const option: Version.SetDefaultAxios = {
    replacements: {
      id: data.orgId,
      verId: data.id,
      temId: data.templateId, //模板id
    },
    params: {
      tempType: data.type,
    },
  };
  return requestV2.versionSetDefault(option).then(() => {
    ElMessage.success(`成功将版本${data.version}设置默认版本！`);
  });
};
export const onDraw = (data: VersionManage.Instance, isCopy: boolean) => {
  if (isCopy) {
    //@ts-ignore 强制清理掉此处的数据源数据
    data.sourceId = undefined;
  }
  if (data.type === 2) {
    redirectCustomVersion(data);
  } else {
    redirectTemplateVersion(data);
  }
};
