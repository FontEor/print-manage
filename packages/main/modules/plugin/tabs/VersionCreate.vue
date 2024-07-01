<template>
  <el-dialog
    width="580px"
    custom-class="express-create-dialog source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    center
    :title="state.title"
    :close-on-click-modal="false"
  >
    <el-form
      class="disabled-form"
      :inline="true"
      ref="form"
      :model="state.form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="版本号" prop="data.code">
        <el-input
          :disabled="props.action !== 'create'"
          placeholder="请输入版本号"
          v-model="state.form.data.code"
        />
      </el-form-item>
      <el-form-item label="下载地址" prop="data.downloadLink">
        <el-input placeholder="请输入公网访问地址" v-model="state.form.data.downloadLink" />
      </el-form-item>
      <el-form-item label="安装包指纹" prop="data.fingerprint">
        <el-input placeholder="请输入安装包指纹" v-model="state.form.data.fingerprint" />
      </el-form-item>
      <el-form-item label="备注" prop="data.remark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="该版本有何特殊之处,是否提供给特殊场景使用的"
          v-model="state.form.data.remark"
        />
      </el-form-item>
      <el-form-item label="版本说明" prop="data.describe">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="新增了哪些能力,修复了哪些bug,优化了哪些功能"
          v-model="state.form.data.describe"
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
  import { reactive, ref, ComponentPublicInstance } from 'vue';
  import { ElForm, ElMessage, FormRules } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType, watch } from 'vue';
  import { requestV1 } from '@/axios/request';

  import { VERSION_REGEXP } from '../../../const/regexp';
  import { PluginVersion } from '../../../types/apis/plugin';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.code': [
      {
        required: true,
        message: '请输入版本号',
      },
      {
        pattern: VERSION_REGEXP,
        message: '请输入,格式:数字.数字.数字.数字',
      },
    ],
    'data.downloadLink': [
      {
        required: true,
        message: '请输入下载地址',
      },
      {
        min: 1,
        max: 500,
        message: '请输入1到500位',
      },
    ],
    'data.remark': [
      {
        min: 1,
        max: 500,
        message: '请输入1到500位',
      },
    ],
    'data.describe': [
      {
        required: true,
        message: '请输入版本说明',
      },
      {
        min: 1,
        max: 1000,
        message: '请输入1到1000位',
      },
    ],
    'data.fingerprint': [
      {
        required: true,
        message: '请输入安装包指纹',
      },
      {
        min: 1,
        max: 64,
        message: '请输入1到64位',
      },
    ],
  };

  const formData = (data?: PluginVersion.Instance): PluginVersion.CreateAxios => {
    if (data) {
      return {
        data: {
          id: data.id,
          code: data.code,
          describe: data.describe,
          downloadLink: data.downloadLink,
          remark: data.remark,
          fingerprint: data.fingerprint,
        },
      };
    }
    return {
      data: {
        code: '',
        describe: '',
        downloadLink: '',
        remark: '',
        fingerprint: '',
      },
    };
  };

  const state = reactive({
    visible: true,
    form: formData(),
    title: '',
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    action: {
      type: String as PropType<string>,
      default: 'create',
    },
    data: {
      type: Object as PropType<PluginVersion.Instance>,
    },
  });

  const emits = defineEmits(['closed']);

  watch(
    () => props.visible,
    (n) => {
      if (n) {
        switch (props.action) {
          case 'create':
            state.title = '新增插件版本';
            break;
          case 'edit':
            state.title = '编辑版本信息';
            state.form = formData(props.data);
            break;
          case 'info':
            state.title = '查看插件版本';
            state.form = formData(props.data);
            break;
          default:
            break;
        }
      }
    },
  );

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
      if (props.action === 'edit') {
        requestV1
          .pluginVersionUpdate({
            replacements: {
              id: data.data.id as number,
            },
            data: {
              describe: data.data.describe,
              downloadLink: data.data.downloadLink,
              fingerprint: data.data.fingerprint,
              remark: data.data.remark,
            },
          })
          .then(() => {
            ElMessage.success('保存成功');
            onClosed({ refresh: true });
          });
      } else {
        requestV1.pluginVersionCreate(data).then(() => {
          ElMessage.success('创建成功');
          onClosed({ refresh: true });
        });
      }
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'CreateDialog',
  };
</script>
