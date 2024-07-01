<template>
  <el-dialog
    v-model="state.dialogVisible"
    title="使用模板"
    :before-close="cancel"
    :close-on-click-modal="false"
    :show-close="false"
    class="template-add-dialog"
  >
    <template #header>
      <div>
        <h4>使用模板</h4>
      </div>
    </template>
    <div class="template-add-title"> 请填写模板基础信息 </div>
    <el-form
      ref="formRef"
      :model="templateData"
      :rules="rules"
      label-width="80px"
      class="demo-templateData"
      status-icon
    >
      <el-form-item label="模板编码" prop="customTempCode">
        <el-input v-model="templateData.customTempCode" placeholder="示例：jdkd76x130" />
      </el-form-item>
      <el-form-item label="模板名称" prop="customTempName">
        <el-input v-model="templateData.customTempName" placeholder="示例：京东快递76x130" />
      </el-form-item>
      <el-form-item label="模板分类" prop="category">
        <el-cascader
          placeholder="请选择模板分类"
          v-model="templateData.category"
          :options="state.categoryList"
          :props="{
            value: 'code',
            label: 'name',
          }"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
          class="list-search_item w100p"
        />
      </el-form-item>
      <el-form-item label="数据源" prop="sourceId">
        <el-select v-model="templateData.sourceId" placeholder="选择数据源" clearable>
          <el-option
            v-for="item in state.sourceOptions"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="纸张尺寸" :rules="{ required: true }">
        <div class="use-template-by-copy-size-wrap">
          <el-form-item prop="width">
            <el-select
              filterable
              allow-create
              default-first-option
              v-model="templateData.width"
              placeholder="mm"
            >
              <template #prefix>宽</template>
              <el-option
                v-for="item in size.widthList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-icon class="multiply"><Close /></el-icon>
          <el-form-item prop="height">
            <el-select
              filterable
              allow-create
              default-first-option
              v-model="templateData.height"
              placeholder="mm"
            >
              <template #prefix>高</template>
              <el-option
                v-for="item in size.heightList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="使用说明" prop="des">
        <el-input
          v-model="templateData.des"
          :rows="3"
          type="textarea"
          placeholder="可以填写模板描述或用途，帮助其他用户快速了解"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, PropType, reactive, ref, onMounted } from 'vue';
  import { rules } from '../rules';
  import lodash from 'lodash';
  import type { FormInstance } from 'element-plus';
  import selectList from '@/mixins/selectList';
  import { Session } from '@/utils/session';
  import { SourceData } from '@/types/apis/sourceData';
  import { requestV2 } from '@/axios/request';
  import type { TemplateMarket } from '@/types/apis/template-market';
  import type { TemplateCategory } from '@/types/apis/template-category';
  import { widthList, heightList } from '@/components/templates/create-blank-template/sizes';

  export default defineComponent({
    components: {},
    props: {
      visible: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      instance: {
        type: Object as PropType<TemplateMarket.TemplateMarketListResponse>,
        required: true,
      },
    },
    emits: ['close'],
    setup(props, { emit }) {
      const size = reactive({
        widthList,
        heightList,
      });
      const state = reactive({
        sourceOptions: [] as SourceData.Instance[], // 数据源列表
        orgId: Session.getOrgId(),
        dialogVisible: false,
        categoryList: [] as TemplateCategory.Instance[],
      });
      const { getCategoryList } = selectList(state);
      const templateData: TemplateMarket.CreateTemplateFromMarket = reactive({
        height: '',
        width: '',
        customTempCode: '',
        customTempName: '',
        category: [], // 模版分类
        des: '',
        sourceId: '',
        isPage: 1,
      });
      const formRef = ref<FormInstance>();
      const { getSourceList } = selectList(state);

      onMounted(async () => {
        state.dialogVisible = props.visible;
        await getSourceList(Session.getOrgId());
        getCategoryList();
      });

      function submitForm(formEl: FormInstance | undefined) {
        formEl?.validate((valid) => {
          if (valid) {
            const firstCategoryCode = lodash.get(templateData, 'category[0]');
            const secondCategoryCode = lodash.get(templateData, 'category[1]');
            const data = {
              code: templateData.customTempCode,
              name: templateData.customTempName,
              templateFirstCategoryCode: firstCategoryCode,
              templateSecondCategoryCode: secondCategoryCode,
              sourceId: `${templateData.sourceId}`,
              width: +templateData.width,
              height: +templateData.height,
              hasCustom: props.instance.hasCustom,
              des: templateData.des as string,
              scene: 'market',
            };
            const replacements = { orgId: state.orgId, versionId: props.instance.versionId };
            requestV2.templateAddAllCustonToList({ data, replacements }).then((response) => {
              // 两组数据 data用作当前系统跳转 -> 管理模板页面
              // editData 用作绘制整个模板 跳转至模板 编辑器
              const editData = response.data;
              const data: TemplateMarket.StateDetailCustom = {
                id: response?.data.id,
                verId: response?.data.verId,
                orgId: response?.data.orgId,
                code: response?.data.code,
                sourceId: response?.data.sourceId,
                isAllCustom: true, // 与绘制自定义区 区分 true表示绘制整个模板
                areaId: response?.data.areaId,
                templateType: response?.data.templateType,
                parentTemplateId: response?.data.parentTemplateId,
                parentTemplateCode: response?.data.parentTemplateCode,
              };
              emit('close', true, data, editData);
            });
          }
        });
      }

      function cancel() {
        emit('close');
      }
      return {
        emit,
        size,
        state,
        props,
        formRef,
        templateData,
        submitForm,
        cancel,
        rules,
      };
    },
  });
</script>
