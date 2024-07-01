<template>
  <div>
    <el-dialog
      title="确认提示"
      :model-value="props.visible"
      lock-scroll
      :append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :destroy-on-close="true"
      width="400px"
    >
      <span>绑定模板成功，可直接使用此模板进行面单打印</span>
      <template #footer>
        <el-button type="primary" @click="onConfirm">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { PropType, reactive } from 'vue';

  import broadcastMessage, { BroadcastMessage } from '../../utils/broadcast/message';
  import { TemplateImages } from '../../types/apis/template';

  const state = reactive({});

  const props = defineProps({
    visible: {
      type: Boolean,
    },
    data: {
      type: Object as PropType<TemplateImages.Instance>,
    },
  });

  const emits = defineEmits(['close']);

  const onConfirm = () => {
    if (props.data) {
      const id = props.data.id;
      broadcastMessage
        .sendMessage({
          type: 'relation-template',
          data: {
            tempId: id,
            tempType: 1,
            templateCode: props.data.code,
          },
        })
        .then((response) => {
          const data = response as BroadcastMessage.MessageData<any>;
          if (data.success) {
            emits('close');
          }
        });
    }
  };
</script>
