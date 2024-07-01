<template>
  <div class="overview detail-container">
    <div class="overview-form">
      <el-form
        ref="templateFormRef"
        class="form-template detail-from disabled-form"
        :class="{
          'detail-form-view': !state.editState,
        }"
        :model="state.templateForm"
        :rules="rules"
        :label-width="'200px'"
      >
        <el-form-item label="标准区模板名称" prop="params.code">
          <div class="detail-form-view-field">
            {{ props.detail.tempName }}
          </div>
        </el-form-item>
        <el-form-item label="模板编码" prop="params.code">
          <div class="detail-form-view-field">
            {{ props.detail.code }}
          </div>
        </el-form-item>
        <el-form-item label="模板名称" prop="params.name">
          <el-input
            v-if="state.editState"
            v-model="state.templateForm.params.name"
            placeholder="请输入模板名称"
          />
          <span v-else class="detail-form-view-field">{{ state.templateForm.params.name }}</span>
        </el-form-item>
        <!-- 添加数据源 -->
        <el-form-item label="数据源" prop="params.sourceId">
          <el-select
            v-model="state.templateForm.params.sourceId"
            placeholder="未选择数据源"
            clearable
            :disabled="!state.editState || (state.editState && state.hasVersion)"
          >
            <el-option
              v-for="source in state.sourceOptions"
              :key="source.id"
              :label="source.name"
              :value="`${source.id}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否分页" prop="params.isPage">
          <el-radio-group
            v-model="state.templateForm.params.isPage"
            :disabled="!state.editState || (state.editState && state.hasVersion)"
          >
            <el-radio :label="1">分页</el-radio>
            <el-radio :label="0">不分页</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前默认版本" prop="params.currentPushVer">
          <div class="detail-form-view-field">
            {{ props.detail.currentDefaultVer }}
          </div>
        </el-form-item>
        <el-form-item label="模板URL" prop="params.coverImage">
          <div class="detail-form-view-field wb">
            {{ props.detail.tempUrl }}
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" v-if="!state.editState" @click="handleEdit">编辑</el-button>
        <div v-if="state.editState">
          <el-button type="primary" @click="handleSave(templateFormRef)">确定</el-button>
          <el-button @click="resetForm(templateFormRef)">取消</el-button>
        </div>
      </div>
    </div>
    <div class="overview-preview">
      <p class="preview-title">当前默认版本预览图：</p>
      <el-image
        v-if="props.detail.defaultCoverImage"
        style="max-width: 320px; max-height: 500px"
        :src="`${state.urlPrefix}${props.detail.defaultCoverImage}`"
        fit="contain"
      >
        <template #error>
          <div></div>
        </template>
      </el-image>
      <div v-else class="preview-block">
        <img src="@/assets/img/open-template/no-pic.png" />
        <span class="demonstration">还未生成预览图</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep } from 'lodash';
  import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
  import { PropType, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { requestV1 } from '@/axios/request';
  import type { openTemplateData } from '../../types/apis/openTemplateData';
  import { SystemData } from '../../types/apis/systemData';
  import selectListMixins from '../../mixins/selectList';
  import type { FormRules } from 'element-plus';
  import type { ElForm } from 'element-plus';
  import { ElMessage } from 'element-plus';
  import { CloseBold } from '@element-plus/icons-vue';
  import { Custom } from '../../types/apis/custom';
  import { Business } from '../../types/apis/business';
  import { SourceData } from '../../types/apis/sourceData';
  import { Session } from '../../utils/session';

  type FormInstance = InstanceType<typeof ElForm>;
  const templateFormRef = ref<FormInstance>();

  const formData = (): Custom.ChangeDataAxios => ({
    params: {
      name: '',
      sourceId: '',
      isPage: 1,
    },
    replacements: {
      id: 0,
      temId: 0,
    },
  });

  const rules: FormRules = {
    'params.name': [
      {
        required: true,
        message: '请填写模板名称',
      },
      // {
      //   pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
      //   message: "模板名称只支持汉字、字母及数字",
      // },
      {
        min: 2,
        max: 50,
        message: '模板名称不能超过50个字符',
      },
    ],
  };
  const props = defineProps({
    detail: {
      type: Object as PropType<Custom.Instance>,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['getTemplateDetail']);

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    editState: false,
    templateForm: formData(),
    orgOptions: [] as SystemData.Instance[], //系统类型
    specifIdOptions: [] as openTemplateData.Instance[], //面单类型
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    sourceOptions: [] as SourceData.Instance[], //承运商
    hasCustomOptionList: [
      {
        value: 0,
        label: '否',
      },
      {
        value: 1,
        label: '是',
      },
    ],
    id: 0,
    temId: 0,
    hasVersion: false,
  });

  const { getDeliveryList, formatDeliveryCode, getSourceList } = selectListMixins(state);

  onMounted(() => {
    const route = useRoute();
    state.id = Number(route.query.id);
    state.temId = Number(route.query.temId);
    getDeliveryList();
    getSourceList(Session.getOrgId());
  });

  //赋初始值
  const pickData = (detail: Custom.Instance | undefined) => {
    if (detail) {
      state.templateForm.params.name = detail.name;
      state.templateForm.params.isPage = detail.isPage;
      state.templateForm.params.sourceId = `${detail.sourceId || ''}`;
    }
  };

  watch(
    () => props.detail,
    (n) => {
      if (n) {
        pickData(n);
      } else {
        state.templateForm = formData();
      }
    },
    {
      immediate: true,
    },
  );

  // 编辑按钮
  const handleEdit = () => {
    requestV1
      .versionList({
        params: {
          from: 1,
          size: 1,
          tempType: 2,
        },
        replacements: {
          id: props.detail?.orgId,
          temId: props.detail?.id,
        },
      })
      .then((response) => {
        if (response.data.length) {
          state.hasVersion = true;
        } else {
          state.hasVersion = false;
        }
        state.editState = true;
      });
  };

  // 确认按钮
  const handleSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
      if (valid) {
        const params = cloneDeep(state.templateForm.params);
        const { id, temId } = state;
        requestV1.customUpdate({ params, replacements: { id, temId } }).then((res) => {
          ElMessage.success('保存成功');
          state.editState = false;
          emits('getTemplateDetail');
        });
      } else {
        return false;
      }
    });
  };

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    pickData(props.detail);
    state.editState = false;
  };
</script>

<style lang="less" scoped>
  .overview {
    padding-top: 14px;
    display: flex;
    .overview-form {
      width: 600px;

      .form-template {
        .connected-icon {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }
        :deep(.el-form-item__content) {
          text-align: left;
        }
      }
    }
    .overview-preview {
      margin-left: 200px;
      .preview-title {
        text-align: left;
        margin-bottom: 20px;
      }
      .preview-block {
        .demonstration {
          display: block;
          margin-top: 20px;
          color: #909399;
        }
      }
    }
  }
</style>
