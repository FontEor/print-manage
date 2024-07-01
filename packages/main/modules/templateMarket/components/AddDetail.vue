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
  import type { FormInstance } from 'element-plus';
  import selectList from '@/mixins/selectList';
  import { Session } from '@/utils/session';
  import { Standard } from '@/types/apis/standard';
  import { SourceData } from '@/types/apis/sourceData';
  import { requestV2 } from '@/axios/request';
  import { TemplateMarket } from '@/types/apis/template-market';

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
      const state = reactive({
        sourceOptions: [] as SourceData.Instance[], // 数据源列表
        orgId: Session.getOrgId(),
        dialogVisible: false,
      });
      const templateData: Standard.CreateUserTemplateInfo = reactive({
        customTempCode: '',
        customTempName: '',
        des: '',
        sourceId: '',
        isPage: 1,
      });
      const formRef = ref<FormInstance>();
      const { getSourceList } = selectList(state);

      onMounted(async () => {
        state.dialogVisible = props.visible;
        await getSourceList(Session.getOrgId());
        console.log('sourceOptions', state.sourceOptions);
        console.log('instance', props.instance);
      });

      function submitForm(formEl: FormInstance | undefined) {
        formEl?.validate((valid) => {
          console.log('instance', props.instance);
          if (valid) {
            console.log('valid', valid);
            const replacements = {
              orgId: state.orgId,
            };
            const data = {
              ...templateData,
              deliveryCode: props?.instance?.deliveryCode,
              specifId: props?.instance?.specifId,
              hasCustom: 1,
              height: props?.instance?.height,
              tempCode: props?.instance?.code,
              tempId: String(props?.instance?.templateId),
              width: props?.instance?.width,
              scene: 'market',
            };
            requestV2.templateAddCustonToList({ data, replacements }).then((response) => {
              const data: TemplateMarket.StateDetailCustom = {
                id: response?.data.id,
                verId: response?.data.verId,
                orgId: response?.data.orgId,
                code: response?.data.code,
                sourceId: response?.data.sourceId,
                areaId: response?.data.areaId,
                templateType: response?.data.templateType,
                parentTemplateId: response?.data.parentTemplateId,
                parentTemplateCode: response?.data.parentTemplateCode,
              };
              emit('close', true, data);
            });
          }
        });
      }

      function cancel() {
        emit('close');
      }
      return {
        emit,
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
