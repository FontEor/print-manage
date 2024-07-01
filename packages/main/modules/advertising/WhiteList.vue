<template>
  <el-dialog
    :model-value="props.visible"
    title="商家白名单"
    width="520px"
    :before-close="handleClose"
    modal-class="create-template-dialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="create-template-form p-0"
    >
      <el-form-item label="商家pin被添加到白名单中后，商家的面单将不会打印出广告信息" prop="pins">
        <el-input
          class="resize-none"
          type="textarea"
          :rows="5"
          v-model.trim="form.pins"
          resize="none"
          placeholder="如：pin1，pin2；长度校验：0-300；"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm(formRef)">保存</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { ref, watch, reactive } from 'vue';
  import type { FormInstance, FormRules } from 'element-plus';
  import { requestV2 } from '@/axios/request';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['close', 'success', 'open']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });
  const formRef = ref<FormInstance>();

  const rules: FormRules = {
    pins: [
      {
        max: 300,
        message: '长度不能超过300',
        trigger: 'blur',
      },
    ],
  };

  const form = reactive({
    pins: '',
  });
  const handleClose = (ifResetField = true) => {
    emit('close');
    if (ifResetField) {
      formRef.value?.resetFields();
    } else {
      formRef.value?.clearValidate();
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleConfirm = (formEl: FormInstance | undefined) => {
    formEl?.validate((valid) => {
      if (valid) {
        const pins = form.pins.split(/[,，]/);
        requestV2
          .adWhiteListUpdate({
            data: pins,
          })
          .then(() => {
            ElMessage.success('保存成功');
            emit('success');
            handleClose(false);
          });
      }
    });
  };

  const getDetail = () => {
    requestV2.adWhiteListDetail({}).then((response) => {
      form.pins = (response.data || []).join(',');
    });
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (!newVal) return;
      getDetail();
    },
    { immediate: true },
  );
</script>
<script lang="ts">
  export default {
    name: 'CreateBlankTemplate',
  };
</script>
