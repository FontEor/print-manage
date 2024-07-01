<template>
  <el-dialog @closed="onClosed" v-model="state.innerVisible" title="样例值示例">
    <pre class="text-left">
  {
      "status":{
          "0":"确认",
          "1":"取消"
      },
      "yesOrNo":{
          "yes":"是",
          "no":"否"
      }
  }
    </pre>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, defineProps, watch, watchEffect, toRefs } from 'vue';
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
    name: 'Dialog',
  };
</script>

<style></style>
