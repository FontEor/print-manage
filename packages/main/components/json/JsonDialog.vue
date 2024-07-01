<template>
  <el-dialog
    title="导入JSON数据"
    :model-value="props.visible"
    width="900px"
    :before-close="onClose"
  >
    <!-- 弹框允许 最大宽度 900 最大高度 556px -->
    <JsonView ref="JsonViewRef" :width="840" :height="406" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { PropType, watch } from 'vue';
  import { ElMessage } from 'element-plus';
  import JsonView from './JsonView.vue';
  import { nextTick } from 'vue';

  interface ExtendsMethods {
    setValue(value?: string): void;
    getValue(): string | undefined;
  }

  type JsonViewInstance = InstanceType<typeof JsonView> & ExtendsMethods;
  const JsonViewRef = ref<JsonViewInstance>();

  const state = reactive({
    innerVisible: false,
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    confirmFn: {
      type: Function as PropType<Function>,
      default: () => {},
    },
    json: {
      type: Object as PropType<Object>,
      default: () => {},
    },
  });

  watch(
    () => props.visible,
    (n) => {
      state.innerVisible = n;
      if (!n) {
        JsonViewRef.value?.setValue();
      } else {
        firstSetValue();
      }
    },
    {
      immediate: true,
    },
  );

  const emits = defineEmits(['update:visible']);

  const onConfirm = () => {
    const value = JsonViewRef.value?.getValue();
    if (value) {
      props.confirmFn(value);
    } else {
      ElMessage.error({
        message: '未检测到JSON数据',
        type: 'error',
      });
    }
  };

  const onClose = () => {
    JsonViewRef.value?.setValue();
    emits('update:visible', false);
  };

  const firstSetValue = () => {
    if (JsonViewRef.value) {
      JsonViewRef.value?.setValue(JSON.stringify(props.json, undefined, 2));
    } else {
      nextTick(() => firstSetValue());
    }
  };
</script>

<style></style>
