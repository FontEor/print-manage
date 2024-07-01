<template>
  <el-popover
    @after-enter="onFocus"
    placement="top"
    width="220"
    :visible="state.showPopover"
    popper-class="template-manage-publish-popover pb-10"
  >
    <el-form ref="formRef" label-position="top" label-width="0px" :model="formData" :rules="rules">
      <el-form-item label="" prop="remark" class="mb-2">
        <el-input
          ref="remarkInputRef"
          type="textarea"
          :rows="3"
          v-model="formData.remark"
          resize="none"
          autofocus
          placeholder="填写本次版本的更新内容，示例：模板新增易碎标识"
        />
      </el-form-item>
      <el-form-item label="" prop="defaultFlag" class="mb-2">
        <el-switch
          v-model="formData.defaultFlag"
          active-text=""
          inactive-text="设为默认"
          :active-value="1"
          :inactive-value="2"
        />
      </el-form-item>
      <el-form-item label="" class="template-manage-publish-popover-item mb-0">
        <el-button @click="onCancel()">取消</el-button>
        <el-button @click="handlePublish" type="primary">确定定稿</el-button>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button @click="onShowPopover" v-if="props.type === 'button'" type="primary"
        >定稿</el-button
      >
      <el-link @click="onShowPopover" v-else type="primary" :underline="false">定稿</el-link>
    </template>
  </el-popover>
  <SuccessDialog :visible="state.showSuccessDialog" @close="state.showSuccessDialog = false">
    <template #title>模板已发布到模板市场！</template>
    <template #content>云打印的用户可在模板市场选用您的模板</template>
  </SuccessDialog>
</template>
<script lang="ts" setup>
  import { ComponentPublicInstance, PropType, reactive, ref } from 'vue';
  import type { ElForm } from 'element-plus';
  import { VersionManage } from '@/types/apis/version-manage';
  import SuccessDialog from '@/components/templates/SuccessDialog.vue';
  import { requestV2 } from '@/axios/request';
  import { ElInput, ElMessage } from 'element-plus';

  const emits = defineEmits(['close', 'confirm']);

  const props = defineProps({
    data: {
      type: Object as PropType<VersionManage.Instance>,
      default: () => ({}),
    },
    type: {
      type: String as PropType<'button' | 'link'>,
      default: 'link',
    },
  });

  const state = reactive({
    showSuccessDialog: false,
    showPopover: false,
  });

  const formData = reactive({
    remark: '',
    defaultFlag: 1,
  });

  const rules = {
    remark: [
      { required: true, message: '请输入内容', trigger: 'blur' },
      { min: 5, max: 50, message: '请输入5~50个字符', trigger: 'blur' },
    ],
  };

  const resetFromData = () => {
    formData.remark = '';
    formData.defaultFlag = 1;
    formRef.value?.clearValidate();
  };

  const onCancel = () => {
    resetFromData();
    state.showPopover = false;
    emits('close');
  };

  const onConfirm = () => {
    state.showPopover = false;
    emits('confirm');
  };

  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();

  const onShowPopover = () => {
    state.showPopover = true;
  };

  const handlePublish = () => {
    formRef.value?.validate((valid: boolean) => {
      if (!valid) {
        return false;
      }
      const data = props.data;
      requestV2
        .versionPublish({
          replacements: {
            id: data.orgId,
            verId: data.id,
            temId: data.templateId, //模板id
          },
          params: {
            force: 1,
            tempType: data.type,
            ...formData,
          },
        })
        .then(() => {
          // state.showSuccessDialog = true;
          onConfirm();
          ElMessage.success('发布成功');
        }).catch((error) => {
          if(error === 406) {
            state.showPopover = false;
          }
        });
    });
  };

  const remarkInputRef = ref<ComponentPublicInstance<typeof ElInput>>();
  const onFocus = () => {
    try {
      remarkInputRef.value?.focus();
      remarkInputRef.value?.$el?.focus();
      remarkInputRef.value?.$el?.children[0].focus();
    } catch (e) {
      console.log(e);
    }
  };
</script>
