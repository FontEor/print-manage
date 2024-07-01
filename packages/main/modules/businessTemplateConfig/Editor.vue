<template>
  <el-dialog
    width="530px"
    class="source-create-dialog left-footer-buttons"
    @closed="onClosed"
    v-model="state.visible"
    title="修改商家模板配置"
    center
    :close-on-click-modal="false"
  >
    <el-form
      class="horizontal-form"
      :inline="true"
      ref="formRef"
      :model="formData"
      :rules="editRules"
      label-width="120px"
    >
      <el-form-item label-width="120px" label="商家编码类型" prop="traderCodeType">
        <p>{{ formatBusinessCodeTypeLabel(props.data.traderCodeType || '') }}</p>
      </el-form-item>
      <el-form-item label="商家编码" prop="traderCode">
        <p>{{ props.data.traderCode }}</p>
      </el-form-item>
      <el-form-item label="商家名称" prop="traderName">
        <p>{{ props.data.traderName }}</p>
      </el-form-item>
      <el-form-item label="商家京东账号" prop="traderJdAccount">
        <!--        <p v-if="props.isView">{{ props.data.traderJdAccount }}</p>-->
        <el-input placeholder="请输入京东账号" v-model="formData.traderJdAccount" />
      </el-form-item>
      <el-form-item label="模板分类" prop="categories">
        <p
          >{{ props.data.templateFirstCategoryName }}/{{ props.data.templateSecondCategoryName }}</p
        >
      </el-form-item>
      <el-form-item label="模板编码" prop="templateCode">
        <p>{{ props.data.templateCode }}</p>
      </el-form-item>
      <el-form-item label="模板名称" prop="templateId">
        <p>{{ props.data.templateName }}</p>
      </el-form-item>
      <el-form-item label="配置说明" prop="remark">
        <!--        <p v-if="props.isView">{{ props.data.remark }}</p>-->
        <el-input
          type="textarea"
          :rows="4"
          placeholder="可填写配置说明，以便其他用户快速了解"
          v-model="formData.remark"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <!--    <template #footer v-if="!props.isView">-->
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, defineProps, watch } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { nextTick, PropType } from 'vue';
  import { requestV2 } from '@/axios/request';

  import { BusinessTemplateConfig } from '@/types/apis/business-template-config';
  import { editRules } from './rules';
  import { businessCodeTypes, formatBusinessCodeTypeLabel } from '@/enums/business';
  import { Session } from '@/utils/session';

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    data: {
      type: Object as PropType<BusinessTemplateConfig.DetailInstance>,
      default: () => ({}),
    },
    isView: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });

  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();
  const initFormData = (
    data?: BusinessTemplateConfig.DetailInstance,
  ): BusinessTemplateConfig.UpdateData => {
    if (data) {
      return {
        traderJdAccount: data.traderJdAccount,
        remark: data.remark,
      };
    } else {
      return {
        traderJdAccount: '',
        remark: '',
      };
    }
  };

  const formData = reactive(initFormData());

  const state = reactive({
    visible: true,
    businessCodeType: businessCodeTypes,
  });

  watch(
    () => props.visible,
    (n) => {
      state.visible = n;
      if (n) {
        Object.assign(formData, initFormData(props.data));
        nextTick(() => {
          formRef.value?.clearValidate();
        });
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
        .businessTemplateConfigUpdate({
          data: formData,
          replacements: {
            id: props.data.id,
            orgId: Session.getOrgId() as number,
          },
          params: {
            orgId: Session.getOrgId() as number,
          },
        })
        .then(() => {
          emits('confirm');
          emits('closed');
          ElMessage.success('修改成功');
        });
    });
  };
</script>
