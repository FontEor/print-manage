<template>
  <el-dialog
    width="530px"
    class="source-create-dialog left-footer-buttons"
    @closed="onClosed"
    v-model="state.visible"
    :title="`创建${props.level === 1 ? '一' : '二'}级分类`"
    center
    :close-on-click-modal="false"
  >
    <el-form
      class="horizontal-form"
      :inline="true"
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="60px"
    >
      <el-form-item label="编码" prop="code">
        <el-input placeholder="示例：jdkd" v-model="formData.code" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input placeholder="示例：京东快递" v-model="formData.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">保存</el-button>
      <el-button @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, defineProps, watch } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { nextTick, PropType } from 'vue';
  import { requestV2 } from '@/axios/request';
  import { rules } from './rules';
  import { TemplateClassification } from '@/types/apis/template-classification';

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    level: {
      type: Number as PropType<1 | 2>,
      required: true,
    },
    parentId: {
      type: Number as PropType<number>,
      default: undefined,
    },
  });

  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();

  const initFormData = (): TemplateClassification.CreateDataBase => ({
    code: '',
    name: '',
  });

  const formData = reactive(initFormData());

  const state = reactive({
    visible: true,
  });

  watch(
    () => props.visible,
    (n) => {
      state.visible = n;
      if (n && formRef.value) {
        formRef.value.clearValidate();
      }
    },
    {
      immediate: true,
    },
  );

  const emits = defineEmits(['closed', 'confirm']);

  const onClosed = () => {
    Object.assign(formData, initFormData());
    nextTick(() => {
      formRef.value?.clearValidate();
    });
    emits('closed');
  };

  const onConfirm = () => {
    formRef.value?.validate().then(() => {
      requestV2
        .templateClassifyCreate({
          data: {
            ...formData,
            type: props.level,
            parentId: props.parentId,
          },
        })
        .then(() => {
          emits('confirm');
          emits('closed');
          ElMessage.success('创建成功');
        });
    });
  };
</script>
