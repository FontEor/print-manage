<template>
  <span>
    <el-tooltip class="box-item" effect="dark" content="分享到模板市场" placement="top-start">
      <el-button
        v-if="props.type === 'button'"
        type="info"
        class="template-list-btn-market"
        @click="handleOnline"
        >分享</el-button
      >
      <el-link v-else :underline="false" class="share-button" type="primary" @click="handleOnline"
        >分享</el-link
      >
    </el-tooltip>
    <!-- 下线成功 弹框 -->
    <SuccessDialog :visible="state.showOnlineSuccessDialog" @close="onClose">
      <template #title>模板已发布到模板市场</template>
      <template #content>云打印的用户可在模板市场选用您的模板</template>
    </SuccessDialog>
  </span>
</template>

<script lang="ts" setup>
  import SuccessDialog from '@/components/templates/SuccessDialog.vue';
  import { PropType, reactive } from 'vue';
  import { requestV2 } from '@/axios/request';
  import { TemplateNew } from '@/types/apis/template-new';
  import { ElMessage } from 'element-plus';

  const emits = defineEmits(['refresh']);

  const state = reactive({
    showOnlineSuccessDialog: false,
  });

  const props = defineProps({
    data: {
      type: Object as PropType<TemplateNew.ListInstance>,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'button',
    },
  });

  const handleOnline = () => {
    const data = props.data;
    requestV2
      .templateShare({
        params: {
          id: data.id,
          type: data.type,
          orgId: data.orgId,
        },
      })
      .then(() => {
        ElMessage.success('模板已分享到模板市场！云打印的用户可在模板市场选用您的模板使用');
        // state.showOnlineSuccessDialog = true;
        onClose();
      });
  };

  const onClose = () => {
    state.showOnlineSuccessDialog = false;
    emits('refresh');
  };
</script>
