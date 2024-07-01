<template>
  <el-dialog
    :model-value="props.visible"
    title="模板详情"
    width="550px"
    :before-close="handleClose"
    modal-class="create-template-dialog"
  >
    <el-form
      ref="formRef"
      :model="{}"
      label-position="right"
      label-width="140px"
      class="create-template-form"
    >
      <el-form-item label="模板编码：" prop="channelRange">
        <p>{{ props.data.code }}</p>
      </el-form-item>
      <el-form-item label="模板名称：" prop="title">
        <p>{{ props.data.name }}</p>
      </el-form-item>
      <el-form-item label="模板分类：" prop="category">
        <p>{{ props.data.category }}</p>
      </el-form-item>
      <el-form-item label="纸张尺寸：" prop="category">
        <p>{{ props.data.size }}</p>
      </el-form-item>
      <el-form-item label="是否含自定义区：" prop="category">
        <p>{{ props.data.hasCustom === 1 ? '是' : '否' }}</p>
      </el-form-item>
      <el-form-item label="使用说明：" prop="category">
        <p class="text-left">{{ props.data.des }}</p>
      </el-form-item>
      <el-form-item label="模板URL：" prop="category">
        <p class="text-left">
          {{ props.data.url }}
          <el-link
            class="text-overflow"
            href="javascript: void 0;"
            :underline="false"
            @click.stop="handleCopy(props.data.url)"
            ><i class="jdl-icon-document-copy"></i>
          </el-link>
        </p>
      </el-form-item>
      <el-form-item label="模板发布原因：" prop="category">
        <p class="text-left">{{ props.data.reason }}</p>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue';
  import { DocumentCopy } from '@element-plus/icons-vue';
  import { WaybillTemplateReview } from '@/types/apis/waybill-template-review';
  import { copyFn } from '@/hooks/copy';

  const emit = defineEmits(['close', 'success', 'open']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as PropType<WaybillTemplateReview.Detail>,
      default: () => ({}),
    },
  });

  const handleClose = (ifResetField = true) => {
    emit('close');
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleCopy = (url: string) => {
    copyFn(url);
  };
</script>
<script lang="ts">
  export default {
    name: 'WaybillTemplateReviewDetailDialog',
  };
</script>
