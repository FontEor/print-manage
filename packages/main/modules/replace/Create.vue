<template>
  <el-dialog
    width="530px"
    custom-class="template-replace-create-dialog"
    @closed="onClosed"
    :modelValue="props.visible"
    :title="props.detail ? '编辑置换配置' : '新建置换配置'"
    center
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="state.form" :rules="rules" label-width="120px">
      <el-form-item label="选择新模板" prop="data.templateName">
        <el-form-item>
          <el-select
            clearable
            v-model="state.form.data.templateCode"
            placeholder="选择新模板"
            filterable
            remote
            reserve-keyword
            :remote-method="getStandardList"
            @change="onStandardChange"
          >
            <el-option
              v-for="item in state.standardList"
              :key="item.code"
              :label="`【${item.code}】${item.name}`"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="新模板URL" prop="data.newUrl">
        <el-input
          :disabled="true"
          :rows="2"
          type="textarea"
          placeholder="新模板URL"
          v-model="state.form.data.newUrl"
        />
      </el-form-item>
      <el-form-item label="老模板URL" prop="data.oldUrl">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="老模板URL"
          v-model="state.form.data.oldUrl"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button type="default" @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, watch } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType } from 'vue';
  import type { FormRules } from 'element-plus';
  import { requestV1 } from '@/axios/request';

  import { SourceData } from '../../types/apis/sourceData';
  import { EN_NUM, CN_EN_NUM } from '../../const/regexp';
  import { Session } from '../../utils/session';
  import { Express } from '../../types/apis/express';
  import { TemplateReplace } from '../../types/apis/template';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.newUrl': [
      {
        required: true,
        message: '请输入新URL',
      },
    ],
    'data.oldUrl': [
      {
        required: true,
        message: '请输入老URL',
      },
    ],
    'data.templateName': [
      {
        required: true,
        message: '请选择模板',
      },
    ],
  };

  const formData = (data?: TemplateReplace.Instance): TemplateReplace.CreateAxios => {
    if (data) {
      return {
        data: {
          newUrl: data.newUrl,
          oldUrl: data.oldUrl,
          templateCode: data.templateCode,
          templateName: data.templateName,
        },
      };
    }
    return {
      data: {
        newUrl: '',
        oldUrl: '',
        templateCode: '',
        templateName: '',
      },
    };
  };

  const onStandardChange = (code: string) => {
    if (!code) {
      return getStandardList();
    }
    const instance = (state.standardList || []).find((item) => item.code === code);
    if (instance) {
      state.form.data.templateName = instance.name;
      state.form.data.newUrl = instance.url;
    }
  };

  const getStandardList = (val = '') => {
    requestV1
      .templateReplaceStandardList({
        params: {
          key: val || '',
        },
      })
      .then(({ data }) => {
        state.standardList = data;
      });
  };

  const state = reactive({
    visible: true,
    form: formData(),
    standardList: [] as TemplateReplace.StandardListInstance[],
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    detail: {
      type: Object as PropType<TemplateReplace.Instance>,
      default: undefined,
    },
  });

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        getStandardList();
      }
    },
  );

  watch(
    () => props.detail,
    (n) => {
      state.form = formData(n);
    },
  );

  const emits = defineEmits(['closed']);

  const onClosed = ({ refresh }: { refresh: boolean } = { refresh: false }) => {
    state.form = formData();
    nextTick(() => {
      form.value?.clearValidate();
    });
    emits('closed', {
      refresh,
    });
  };

  const onConfirm = () => {
    form.value?.validate().then(() => {
      const data = clone(state.form);
      if (props.detail) {
        const id = props.detail.id;
        return requestV1
          .templateReplaceUpdate(
            Object.assign({
              data: {
                id: id,
                ...data.data,
              },
            }),
          )
          .then(() => {
            ElMessage.success('更新成功');
            onClosed({ refresh: true });
          });
      }
      requestV1.templateReplaceCreate(data).then(() => {
        ElMessage.success('创建成功');
        onClosed({ refresh: true });
      });
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'CreateDialog',
  };
</script>
