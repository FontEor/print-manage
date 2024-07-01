<template>
  <el-button
    @click="onCopy"
    class="copy-icon-button"
    type="default"
    plain
    icon="el-icon-copy-document"
  />
</template>
<script setup lang="ts">
  import { defineProps } from 'vue';
  import type { PropType } from 'vue';
  import { ElMessage } from 'element-plus';

  import { copyText } from '../../utils/copy';

  const props = defineProps({
    data: {
      type: String as PropType<string>,
      default: '',
    },
  });

  const onCopy = () => {
    copyText(props.data);
    ElMessage.success('复制成功');
  };
</script>

<script lang="ts">
  export default {
    name: 'CopyButton',
  };
</script>
