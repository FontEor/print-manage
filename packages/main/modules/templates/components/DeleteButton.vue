<template>
  <el-link v-if="props.type === 'link'" type="primary" @click="onShowDialog" :underline="false"
    >删除</el-link
  >
  <el-button v-else @click="onShowDialog" type="info" text bg>删除</el-button>
</template>
<script lang="ts" setup>
  import { PropType, h, reactive } from 'vue';
  import { onDelete } from '@/hooks/components/click-event.hook';
  import { VersionManage } from '@/types/apis/version-manage';
  import { ElMessageBox } from 'element-plus';

  const props = defineProps({
    data: {
      type: Object as PropType<VersionManage.Instance>,
      required: true,
    },
    type: {
      type: String as PropType<'link' | 'button'>,
      default: 'link',
    },
  });

  const state = reactive({
    visible: false,
  });

  const emits = defineEmits(['confirm', 'close']);

  const onConfirm = () => {
    onDelete(props.data).then(() => {
      onHideDialog();
      emits('confirm');
    });
  };

  const onClose = () => {
    onHideDialog();
    emits('close');
  };

  const onShowDialog = () => {
    // state.visible = true;
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '是否确认删除'),
        h(
          'div',
          { class: 'el-message-box-confirm_content' },
          '该版本的基础信息及模板样式,都将被删除，您确认删除吗？',
        ),
      ]),
      '',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'el-message-box-confirm',
      },
    )
      .then(() => {
        onConfirm();
      })
      .catch(() => {
        onClose();
      });
  };

  const onHideDialog = () => {
    state.visible = false;
  };
</script>
