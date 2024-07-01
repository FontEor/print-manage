<template>
  <el-tooltip effect="dark" content="新建" placement="top">
    <el-button type="primary" circle @click="emits('click')">
      <el-icon :size="20">
        <Plus />
      </el-icon>
    </el-button>
  </el-tooltip>
</template>
<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue';
  const emits = defineEmits(['click']);
</script>
<script lang="ts">
  export default {
    name: 'CreateFixedButton',
  };
</script>
