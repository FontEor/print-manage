<template>
  <div :class="`size-input-wrap ${wrapFocusClass}`" tabindex="0">
    <el-input
      class="pre-input"
      v-model.number="state.width"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleChangeWidth"
    >
      <template #prepend>宽</template>
      <template #append>mm</template>
    </el-input>
    <p class="line"></p>
    <el-input
      class="after-input"
      v-model.number="state.height"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleChangeHeight"
    >
      <template #prepend>高</template>
      <template #append>mm</template>
    </el-input>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, reactive, watch, ref } from 'vue';
  import { UnwrapNestedRefs } from 'vue';
  import { TemplateNew } from '@/types/apis/template-new';

  export default defineComponent({
    name: 'SizeInput',
    props: {
      width: {
        type: null as unknown as PropType<number | undefined>,
        required: true,
      },
      height: {
        type: null as unknown as PropType<number | undefined>,
        required: true,
      },
    },
    emits: ['update:width', 'update:height'],

    setup(props, { emit }) {
      const state: UnwrapNestedRefs<TemplateNew.SizeInputState> = reactive({
        width: props.width || undefined,
        height: props.height || undefined,
      });
      watch(
        () => props.width,
        (val) => {
          state.width = val || undefined;
        },
      );
      watch(
        () => props.height,
        (val) => {
          state.height = val || undefined;
        },
      );
      const handleChangeWidth = () => {
        emit('update:width', state.width);
      };
      const handleChangeHeight = () => {
        emit('update:height', state.height);
      };
      const wrapFocusClass = ref('');
      const handleFocus = () => {
        wrapFocusClass.value = 'is-focus';
      };
      const handleBlur = () => {
        wrapFocusClass.value = '';
      };
      return {
        state,
        handleChangeWidth,
        handleChangeHeight,
        handleFocus,
        handleBlur,
        wrapFocusClass,
      };
    },
  });
</script>
