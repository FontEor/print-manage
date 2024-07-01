<template>
  <span>
    <el-tooltip class="box-item" effect="dark" content="取消分享至模板市场" placement="top-start">
      <el-button
        v-if="props.type === 'button'"
        class="template-list-btn-market"
        type="info"
        @click="cancelShare"
        >取消分享</el-button
      >
      <el-link v-else :underline="false" class="share-button" type="primary" @click="cancelShare"
        >取消分享
      </el-link>
    </el-tooltip>
  </span>
</template>
<script lang="ts" setup>
  import { PropType, reactive, h } from 'vue';
  import { requestV2 } from '@/axios/request';
  import { TemplateNew } from '@/types/apis/template-new';
  import { ElMessageBox, ElMessage } from 'element-plus';

  const emits = defineEmits(['refresh']);

  const state = reactive({
    showOfflineDialog: false,
    showOfflineSuccessDialog: false,
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

  const handleOffline = () => {
    requestV2
      .templateCancelShare({
        params: {
          id: props.data.id,
          type: props.data.type,
          orgId: props.data.orgId,
        },
      })
      .then(() => {
        state.showOfflineDialog = false;
        ElMessage.success('成功取消分享至模板市场');
        onClose();
      });
  };
  const cancelShare = () => {
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '是否确认取消分享'),
        h(
          'div',
          { class: 'el-message-box-confirm_content' },
          '取消分享后用户将不会在模板市场看到此模板，但不会影响已使用此模板的用户继续使用模板。是否确认取消分享？',
        ),
      ]),
      '',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'el-message-box-confirm',
      },
    ).then(() => {
      handleOffline();
    });
  };
  const onClose = () => {
    emits('refresh');
  };
</script>
