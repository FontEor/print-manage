<template>
  <el-dialog
    width="530px"
    class="source-create-dialog left-footer-buttons"
    @closed="onClosed"
    v-model="state.visible"
    title="新增商家模板配置"
    center
    :close-on-click-modal="false"
  >
    <el-form
      class="horizontal-form"
      :inline="true"
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label-width="120px" label="商家编码类型" prop="traderCodeType">
        <el-select
          clearable
          v-model="formData.traderCodeType"
          class="m-2"
          placeholder="商家编码类型"
          @blur="getBusinessName"
        >
          <el-option
            v-for="item in state.businessCodeType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商家编码" prop="traderCode">
        <el-input
          placeholder="请输入商家编码"
          v-model="formData.traderCode"
          @blur="getBusinessName"
        />
      </el-form-item>
      <el-form-item label="商家名称" prop="traderName">
        <el-input placeholder="请输入商家名称" v-model="formData.traderName" />
      </el-form-item>
      <el-form-item label="商家京东账号" prop="traderJdAccount">
        <el-input placeholder="请输入京东账号" v-model="formData.traderJdAccount" />
      </el-form-item>
      <el-form-item label="模板分类" prop="categories">
        <el-cascader
          v-model="formData.categories"
          :options="state.categoryList"
          :props="{ multiple: false, value: 'code', label: 'name' }"
          class="list-search_item w100p"
          clearable
          collapse-tags
          collapse-tags-tooltip
          filterable
          placeholder="选择模板分类"
          @change="getTemplateName"
        />
      </el-form-item>
      <el-form-item label="模板编码" prop="templateCode">
        <el-input
          placeholder="请输入模板编码"
          v-model="formData.templateCode"
          @blur="getTemplateName"
        />
      </el-form-item>
      <el-form-item label="模板名称" prop="templateId">
        <el-input
          placeholder="根据模板编码与分类自动带出"
          v-model="formData.templateName"
          disabled
        />
      </el-form-item>
      <el-form-item label="配置说明" prop="remark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="可填写配置说明，以便其他用户快速了解"
          v-model="formData.remark"
        />
      </el-form-item>
    </el-form>
    <template #footer>
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
  import selectList from '@/mixins/selectList';

  import { BusinessTemplateConfig } from '@/types/apis/business-template-config';
  import { TemplateCategory } from '@/types/apis/template-category';
  import { rules } from './rules';
  import { businessCodeTypes } from '@/enums/business';
  import { Session } from '@/utils/session';

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  });

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const initFormData = (): BusinessTemplateConfig.CreateData => ({
    traderCodeType: 1,
    traderCode: '',
    traderName: '',
    traderJdAccount: '',
    templateCode: '',
    templateId: 0,
    remark: '',
    templateName: '',
    categories: [] as string[],
  });

  const formData = reactive(initFormData());

  const state = reactive({
    visible: true,
    categoryList: [] as TemplateCategory.Instance[], // 模板分类列表
    businessCodeType: businessCodeTypes,
  });

  const { getCategoryList } = selectList(state);

  watch(
    () => props.visible,
    (n) => {
      state.visible = n;
      if (n) {
        getCategoryList();
      }
    },
    {
      immediate: true,
    },
  );

  const emits = defineEmits(['closed', 'confirm']);

  const getBusinessName = () => {
    if (formData.traderCode && formData.traderCodeType) {
      requestV2
        .businessNameByBusinessCode({
          params: {
            traderCode: formData.traderCode,
            traderCodeType: formData.traderCodeType,
          },
          replacements: {
            orgId: Session.getOrgId() as number,
          },
        })
        .then((res) => {
          formData.traderName = res.data || '';
        })
        .catch(() => {
          formData.traderName = '';
        });
    }
  };

  const getTemplateName = () => {
    if (formData.templateCode && formData.categories[1]) {
      requestV2
        .businessGetTemplateByCode({
          params: {
            orgId: Session.getOrgId() as number,
            templateCode: formData.templateCode,
            templateFirstCategoryCode: formData.categories[0],
            templateSecondCategoryCode: formData.categories[1],
          },
          replacements: {
            orgId: Session.getOrgId() as number,
          },
        })
        .then((res) => {
          formData.templateName = res.data?.name || '';
          formData.templateId = res.data?.id || 0;
        })
        .catch(() => {
          formData.templateName = '';
          formData.templateId = 0;
        });
    } else {
      formData.templateName = '';
      formData.templateId = 0;
    }
  };

  const onClosed = () => {
    Object.assign(formData, initFormData());
    nextTick(() => {
      form.value?.clearValidate();
    });
    emits('closed');
  };

  const onConfirm = () => {
    form.value?.validate().then(() => {
      requestV2
        .businessTemplateConfigCreate({
          data: {
            ...formData,
          },
          replacements: {
            orgId: Session.getOrgId() as number,
          },
        })
        .then(() => {
          emits('confirm');
          onClosed();
          ElMessage.success('创建成功');
        });
    });
  };
</script>
