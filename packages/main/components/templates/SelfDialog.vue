<template>
  <el-dialog
    :model-value="props.visible"
    :title="props.title"
    :width="props.width"
    :before-close="handleClose"
    :append-to-body="props.appendToBody"
  >
    <slot name="content"></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue';

  const emit = defineEmits(['close']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String as PropType<string>,
      default: '30%',
    },
  });
  const handleClose = () => {
    emit('close');
  };
</script>
