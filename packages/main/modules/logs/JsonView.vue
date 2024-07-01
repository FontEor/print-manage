<template>
  <el-dialog title="打印报文" :model-value="props.visible" width="900px" :before-close="onClose">
    <!-- 弹框允许 最大宽度 900 最大高度 556px -->
    <JsonView ref="JsonViewRef" :width="840" :height="406" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">复制报文</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { requestV1 } from '@/axios/request';
  import { ref, reactive } from 'vue';
  import { Prop, PropType, watch } from 'vue';
  import { ElMessage } from 'element-plus';
  import JsonView from '../../components/json/JsonView.vue';
  import { copyText } from '../../utils/copy';

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
      default: 0,
    },
    confirmFn: {
      type: Function as PropType<Function>,
      default: () => {},
    },
    json: {
      type: String,
      default: '',
    },
  });

  watch(
    () => props.visible,
    (n) => {
      state.innerVisible = n;
      if (n && JsonViewRef.value) {
        JsonViewRef.value?.setValue(props.json);
      } else {
        nextTick().then(() => JsonViewRef.value?.setValue(props.json));
      }
    },
    {
      immediate: true,
    },
  );

  const emits = defineEmits(['update:visible']);

  const onConfirm = () => {
    const result = copyText(props.json || '');
    if (result) {
      ElMessage.success('复制成功');
    } else {
      ElMessage.error('复制失败, 请手动复制');
    }
    // props.confirmFn();
  };

  const onClose = () => {
    JsonViewRef.value?.setValue('{}');
    emits('update:visible', false);
  };
</script>

<style></style>
