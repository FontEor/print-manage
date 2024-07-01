import { TemplateNew } from '@/types/apis/template-new';
import { requestV2 } from '@/axios/request';
import { ElMessage } from 'element-plus';

export const handleShare = (instance: TemplateNew.Instance, status: 0 | 1) => {
  const options: TemplateNew.ShareAxios = {
    params: {
      orgId: instance.orgId,
      id: instance.id,
      type: instance.type,
    },
  };
  // 分享
  if (status) {
    requestV2
      .templateShare(options)
      .then(() => {
        ElMessage.success('分享成功');
        instance.shared = true;
      })
      .catch(() => ElMessage.error('分享失败'));
  } else {
    // 取消分享
    requestV2
      .templateCancelShare(options)
      .then(() => {
        ElMessage.success('取消分享成功');
        instance.shared = false;
      })
      .catch(() => ElMessage.error('取消分享失败'));
  }
};
