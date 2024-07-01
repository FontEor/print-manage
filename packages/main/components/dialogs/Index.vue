<template>
  <el-dialog @closed="onClosed" v-model="state.innerVisible" title="Shipping address">
    <slot></slot>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, defineProps, watch } from 'vue';
  import { PropType } from 'vue';

  const state = reactive({
    innerVisible: false,
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  });

  const emits = defineEmits(['closed']);

  watch(
    () => props.visible,
    (n) => {
      if (n !== state.innerVisible) {
        state.innerVisible = n;
      }
    },
    {
      immediate: true,
    },
  );

  const onClosed = () => {
    emits('closed');
  };
</script>

<script lang="ts">
  export default {
    name: 'WrapDialog',
  };
</script>

<style></style>
