<template>
  <div
    :id="state.id"
    class="json-view-container"
    :style="{
      width: `${props.width}px`,
      height: `${props.height}px`,
    }"
  ></div>
</template>

<script setup lang="ts">
  import { defineComponent, onMounted, PropType, reactive } from 'vue';
  import { JSONEditorOptions } from 'jsoneditor';
  import 'jsoneditor/dist/jsoneditor.min.css';
  import short from 'shortid';

  import { JsonEditorMixins } from '../../mixins/editor.json';

  let editor: JsonEditorMixins | undefined = undefined;

  const props = defineProps({
    width: {
      type: Number as PropType<number>,
      default: 400,
    },
    height: {
      type: Number as PropType<number>,
      default: 400,
    },
    options: {
      type: Object as PropType<JSONEditorOptions>,
      default: () => {},
    },
  });

  const state = reactive({
    id: short.generate(),
  });

  const initEditor = () => {
    const $container = document.getElementById(state.id);
    if ($container) {
      editor = new JsonEditorMixins($container, props.options);
    } else {
      console.log('容器元素未找到');
    }
  };

  onMounted(() => {
    initEditor();
  });

  const setValue = (value?: string) => {
    if (editor) {
      return editor.setValue(value || '{}');
    }
  };

  const getValue = () => {
    if (editor) {
      return editor.getValue();
    }
  };

  defineExpose({
    getValue,
    setValue,
  });
  defineComponent({
    name: 'JsonView',
  });
</script>
