<template>
  <el-dialog
    width="530px"
    custom-class="standrad-preview-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="预览模板"
    :center="false"
    :close-on-click-modal="true"
  >
    <el-image class="standrad-preview-image" :src="state.url" />
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { PropType, watch } from 'vue';
  const emits = defineEmits(['close']);
  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    url: {
      type: String as PropType<string>,
      default: '',
    },
  });

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    visible: true,
    url: '',
  });

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        state.url = state.urlPrefix + props.url;
      }
    },
  );

  const onClosed = () => {
    emits('close');
  };

  const onConfirm = () => {
    emits('close');
  };
</script>
<script lang="ts">
  export default {
    name: 'PreviewDialog',
  };
</script>
