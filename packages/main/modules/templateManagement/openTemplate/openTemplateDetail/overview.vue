<template>
  <div class="overview">
    <div class="overview-form">
      <el-form
        ref="templateFormRef"
        class="form-template"
        :model="state.templateForm"
        :rules="rules"
        :label-width="formLabelWidth"
      >
        <el-form-item label="模板编码" prop="params.code">
          <span>{{ state.templateForm.params.code }}</span>
        </el-form-item>
        <el-form-item label="模板名称" prop="params.name">
          <el-input
            v-if="state.editState"
            v-model="state.templateForm.params.name"
            placeholder="请输入模板名称"
          />
          <span v-else>{{ state.templateForm.params.name }}</span>
        </el-form-item>
        <el-form-item label="数据源" prop="sourceId">
          <el-select
            v-if="state.editState"
            v-model="state.templateForm.params.sourceId"
            placeholder="选择数据源"
            :disabled="state.hasVersion"
            clearable
          >
            <el-option
              v-for="source in state.sourceOptions"
              :key="source.id"
              :label="source.name"
              :value="`${source.id}`"
            />
          </el-select>
          <span v-else>{{ props.detail?.sourceName }}</span>
        </el-form-item>
        <el-form-item label="承运商" prop="params.deliveryCode">
          <el-select
            v-if="state.editState"
            v-model="state.templateForm.params.deliveryCode"
            placeholder="请选择承运商类型"
            style="width: 100%"
            :disabled="state.hasVersion"
          >
            <el-option
              v-for="item in state.deliveryCodeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <span v-else>{{ formatDeliveryCode(state.templateForm.params.deliveryCode) }}</span>
        </el-form-item>
        <el-form-item label="耗材尺寸" prop="params.width">
          <el-row v-if="state.editState">
            <el-col :span="6">
              <el-form-item label-width="0" label="" prop="params.width">
                <el-input
                  v-model="state.templateForm.params.width"
                  style="width: 100px"
                  placeholder="宽度"
                  :disabled="state.hasVersion"
                >
                  <template #suffix>mm</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="connected-icon" :span="4">
              <el-icon :size="24">
                <close-bold />
              </el-icon>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0" prop="params.height">
                <el-input
                  v-model="state.templateForm.params.height"
                  placeholder="高度"
                  :disabled="state.hasVersion"
                >
                  <template #suffix>mm</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <span v-else>{{
            state.templateForm.params.width + 'mm x ' + state.templateForm.params.height + 'mm'
          }}</span>
        </el-form-item>
        <el-form-item label="是否含自定义区" prop="params.hasCustom">
          <el-select
            v-if="state.editState"
            v-model="state.templateForm.params.hasCustom"
            placeholder="请选择是否含自定义区"
            style="width: 100%"
            :disabled="state.hasVersion"
          >
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
          <span v-else>{{ formatHasCustom(state.templateForm.params.hasCustom) }}</span>
        </el-form-item>
        <el-form-item label="当前默认版本">
          <span>{{ props.detail?.currentDefaultVer }}</span>
        </el-form-item>
        <el-form-item label="模板URL">
          <span class="wb">
            {{ props.detail?.tempUrl }}
          </span>
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
        v-if="props.detail?.defaultCoverImage"
        style="max-width: 320px; max-height: 500px"
        :src="`${state.urlPrefix}${props.detail?.defaultCoverImage}`"
        fit="contain"
      >
        <template #error>
          <div></div>
        </template>
      </el-image>
      <div v-else class="preview-block">
        <img src="@/assets/img/open-template/no-pic.png" alt="预览图" />
        <span class="demonstration">还未生成预览图</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
  import { PropType, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { requestV1 } from '@/axios/request';
  import type { openTemplateData } from '@/types/apis/openTemplateData';
  import { SystemData } from '@/types/apis/systemData';
  import type { FormRules } from 'element-plus';
  import type { ElForm } from 'element-plus';
  import { ElMessage } from 'element-plus';
  import { CloseBold } from '@element-plus/icons-vue';
  import selectListMixins from '../../../../mixins/selectList';
  import { pick } from 'lodash';
  import { SourceData } from '@/types/apis/sourceData';
  import { Session } from '@/utils/session';

  type FormInstance = InstanceType<typeof ElForm>;
  const templateFormRef = ref<FormInstance>();

  const formLabelWidth = '200px';
  const formData = (): openTemplateData.UpdateAxios => ({
    params: {
      code: '',
      orgId: 0,
      name: '',
      sourceId: '',
      deliveryCode: '',
      hasCustom: 0,
      specifId: 0,
      width: 0,
      height: 0,
      currentPushVer: 0,
      coverImage: '',
    },
    replacements: {
      id: 0,
      temId: 0,
    },
  });

  const rules: FormRules = {
    'params.code': [
      {
        required: true,
        message: '请填写模板编码',
      },
      {
        pattern: /^[0-9a-zA-Z]*$/,
        message: '模板编码仅支持英文字母及数字',
      },
      {
        min: 0,
        max: 50,
        message: '模板编码不能超过50个字符',
      },
    ],
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
    'params.orgId': [
      {
        required: true,
        message: '请选择所属系统',
      },
    ],
    'params.sourceId': [
      {
        required: true,
        message: '请选择数据源',
      },
    ],
    // 'params.deliveryCode': [
    //   {
    //     required: true,
    //     message: '请选择承运商类型',
    //   }
    // ],
    'params.specifId': [
      {
        required: true,
        message: '请选择面单样式',
      },
    ],
    'params.hasCustom': [
      {
        required: true,
        message: '请选择是否含自定义区',
      },
    ],
    'params.height': [
      {
        required: true,
        message: '高度',
      },
      {
        pattern: /^[0-9]*$/,
        message: '请填写数字',
      },
    ],
    'params.width': [
      {
        required: true,
        message: '宽度',
      },
      {
        pattern: /^[0-9]*$/,
        message: '请填写数字',
      },
    ],
  };
  const props = defineProps({
    detail: {
      type: Object as PropType<openTemplateData.Instance>,
    },
  });

  const emits = defineEmits(['getTemplateDetail']);

  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    editState: false,
    templateForm: formData(),
    rules,
    orgOptions: [] as SystemData.Instance[], //系统类型
    specifIdOptions: [] as openTemplateData.Instance[], //面单类型
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    sourceOptions: [] as SourceData.Instance[], // 数据源
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

  const { getTempSpecifsList, getSourceList, getDeliveryList, formatDeliveryCode } =
    selectListMixins(state);

  watch(
    () => props.detail,
    (val) => {
      if (val) {
        restoreData(val);
      } else {
        state.templateForm = formData();
      }
    },
    {
      immediate: true,
    },
  );

  onMounted(() => {
    const route = useRoute();
    state.id = Number(route.query.id);
    state.temId = Number(route.query.temId);
    getTempSpecifsList();
    getSourceList(Session.getOrgId());
    getDeliveryList();
  });

  //赋初始值
  const restoreData = (val: openTemplateData.Instance | undefined) => {
    if (val) {
      state.templateForm.params.code = val.code;
      state.templateForm.params.orgId = val.orgId;
      state.templateForm.params.name = val.name;
      state.templateForm.params.sourceId = `${val.sourceId}`;
      state.templateForm.params.deliveryCode = val.deliveryCode;
      state.templateForm.params.hasCustom = val.hasCustom;
      state.templateForm.params.specifId = val.specifId;
      state.templateForm.params.width = val.width;
      state.templateForm.params.height = val.height;
      state.templateForm.params.currentPushVer = val.currentPushVer;
      state.templateForm.params.coverImage = val.coverImage;
    }
  };

  // 是否自定义转换
  const formatHasCustom = (hasCustom: number) => {
    const hasCustomMap = ['否', '是'];
    return hasCustomMap[hasCustom];
  };
  // 编辑按钮
  const handleEdit = () => {
    requestV1
      .versionList({
        params: {
          from: 1,
          size: 1,
          tempType: 1,
        },
        replacements: {
          id: props.detail?.orgId,
          temId: props.detail?.id,
        },
      })
      .then((response) => {
        state.hasVersion = !!response.data.length;
        state.editState = true;
      });
  };

  // 确认按钮
  const handleSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: any) => {
      if (valid) {
        const params = pick(state.templateForm.params, [
          'name',
          'width',
          'height',
          'hasCustom',
          'deliveryCode',
          'sourceId',
        ]);
        const { id, temId } = state;
        requestV1.openTemplateUpdate({ params, replacements: { id, temId } }).then(() => {
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
    restoreData(props.detail);
    state.editState = false;
  };
</script>

<style lang="less" scoped>
  .overview {
    padding-top: 14px;
    display: flex;
    .overview-form {
      width: 600px;
      min-width: 500px;

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
      margin-left: 8vw;
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
