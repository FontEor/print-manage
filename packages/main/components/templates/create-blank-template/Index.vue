<template>
  <el-dialog
    :model-value="props.visible"
    title="创建模板"
    width="520px"
    :before-close="handleClose"
    modal-class="create-template-dialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="121px"
      class="create-template-form"
    >
      <el-form-item label="模板编码" prop="code">
        <el-input v-model="form.code" placeholder="示例：jdkd76x130" />
      </el-form-item>
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="form.name" placeholder="示例：京东快递76x130" />
      </el-form-item>
      <el-form-item label="模板分类" prop="category">
        <el-cascader
          ref="classifyRef"
          v-model="form.category"
          :props="{ value: 'code', label: 'name' }"
          :options="state.categoryList"
          filterable
        />
      </el-form-item>
      <el-form-item label="数据源" prop="sourceId">
        <el-select v-model="form.sourceId" placeholder="选择数据源" clearable>
          <el-option
            v-for="item in state.sourceOptions"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="纸张尺寸" :rules="[{ required: true }]">
        <div class="use-template-by-copy-size-wrap">
          <el-form-item prop="width">
            <el-select
              v-model="form.width"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="mm"
            >
              <template #prefix>宽</template>
              <el-option
                v-for="item in widthList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-icon class="multiply"><CloseBold /></el-icon>
          <el-form-item prop="height">
            <el-select
              v-model="form.height"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="mm"
            >
              <template #prefix>高</template>
              <el-option
                v-for="item in heightList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="是否含自定义区" prop="hasCustom">
        <el-radio-group v-model="form.hasCustom">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签" prop="tagIds">
        <el-select v-model="form.tagIds" placeholder="选择标签" filterable multiple>
          <el-option
            v-for="item in state.tagList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用说明" prop="des">
        <el-input
          type="textarea"
          :rows="3"
          v-model="form.des"
          placeholder="可以填写模板描述或用途，帮助其他用户快速了解"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm(formRef)">创建</el-button>
    </template>
  </el-dialog>
  <SuccessDialog
    :visible="state.showSuccessDialog"
    @close="state.showSuccessDialog = false"
    :hasTitle="false"
    class="create-blank-success"
  >
    <template #content>创建模板成功</template>
    <template #footer>
      <el-button @click="handleCreateTemplate">继续创建模板</el-button>
      <el-button @click="handleDrawTemplate" type="primary">去绘制模板</el-button>
    </template>
  </SuccessDialog>
</template>
<script lang="ts" setup>
  import { ref, watch, reactive } from 'vue';
  import type { FormInstance } from 'element-plus';
  import { CloseBold } from '@element-plus/icons-vue';
  import SuccessDialog from '../SuccessDialog.vue';
  import { requestV2 } from '@/axios/request';
  import { SourceData } from '@/types/apis/sourceData';
  import { Session } from '@/utils/session';
  import lodash from 'lodash';
  import { rules } from './rules';
  import { widthList, heightList } from './sizes';
  import { TemplateCategory } from '@/types/apis/template-category';
  import selectList from '@/mixins/selectList';
  import { TemplateTag } from '@/types/apis/template-tag';
  import { TemplateNew } from '@/types/apis/template-new';
  import { redirectTemplateEditor } from '@/hooks/web/redirect';

  const emit = defineEmits(['close', 'success', 'open']);
  const classifyRef = ref(null);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });
  const formRef = ref<FormInstance>();

  const initForm = function (): TemplateNew.CreateFrom {
    return {
      code: '', // 模板编码
      name: '', // 模板名称
      sourceId: '', // 数据源
      hasCustom: null, // 是否含自定义区
      width: '',
      height: '',
      des: '', // 使用说明
      tagIds: [] as Array<number>, // 标签
      orgId: Session.getOrgId(),
      category: [] as Array<string>, // 模版分类
    };
  };

  const form = reactive(initForm());

  const state = reactive({
    detail: {} as TemplateNew.ListInstance,
    showSuccessDialog: false,
    tagList: [] as TemplateTag.Instance[],
    categoryList: [] as TemplateCategory.Instance[],
    sourceOptions: [] as Array<SourceData.Instance>, // 数据源列表
  });

  const { getCategoryList, getCurrentSystemTagList, getSourceList } = selectList(state);

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

  // const getCategoryIdByCode = (code: string): number => {
  //   const item = state.categoryList.find((item) => item.code === code);
  //   return item?.id as number;
  // };

  const handleConfirm = (formEl: FormInstance | undefined) => {
    formEl?.validate((valid, fields) => {
      if (valid) {
        const firstCategoryCode = lodash.get(form, 'category[0]');
        const secondCategoryCode = lodash.get(form, 'category[1]');
        const data: TemplateNew.CreateData = {
          code: form.code,
          name: form.name,
          hasCustom: Number(form.hasCustom),
          width: +form.width,
          height: +form.height,
          des: form.des,
          tagIdList: form.tagIds,
          templateFirstCategoryCode: firstCategoryCode,
          templateSecondCategoryCode: secondCategoryCode,
          sourceId: `${form.sourceId}`,
          specifId: 0,
          deliveryCode: '',
        };
        const replacements = { id: form.orgId };
        requestV2.templateCreate({ data, replacements }).then((response) => {
          state.showSuccessDialog = true;
          state.detail = response.data;
          emit('success');
          handleClose(false);
        });
      }
    });
  };

  const handleCreateTemplate = () => {
    state.showSuccessDialog = false;
    handleClose();
    emit('open');
  };
  const handleDrawTemplate = () => {
    redirectTemplateEditor(state.detail, state.detail.verId);
    // 获取最新模板版本ID
    state.showSuccessDialog = false;
    handleClose();
  };
  watch(
    () => props.visible,
    (newVal) => {
      if (!newVal) return;
      getCategoryList();
      getSourceList(Session.getOrgId());
      getCurrentSystemTagList();
    },
    { immediate: true },
  );
</script>
<script lang="ts">
  export default {
    name: 'CreateBlankTemplate',
  };
</script>
