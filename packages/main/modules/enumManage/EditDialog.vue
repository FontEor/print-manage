<template>
  <el-dialog
    width="900px"
    custom-class="property-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="编辑枚举内容"
    center
    :close-on-click-modal="false"
  >
    <el-form
      class="disabled-form"
      :inline="true"
      ref="formRef"
      :model="state.form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="枚举项编码">
        {{ props.data.enumCode }}
      </el-form-item>
      <el-form-item label="枚举项名称" prop="data.enumName">
        <el-input placeholder="请输入枚举名称" v-model="state.form.data.enumName" />
      </el-form-item>
      <el-form-item class="json-editor-form-item" label="枚举内容:" prop="data.enumValue">
        <!-- 弹框允许 最大宽度 900 最大高度 556px -->
        <JsonView ref="jsonViewRef" :width="840" :height="406" :options="{ mainMenuBar: false }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClosed">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  // 依赖
  import { reactive, ref, watch, defineComponent, ComponentPublicInstance } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { cloneDeep } from 'lodash';
  import { nextTick, PropType } from 'vue';
  // 工具
  import { requestV1 } from '@/axios/request';
  // 类型
  import type { FormRules } from 'element-plus';
  import { EnumsManage } from '@/types/apis/enumManage';
  import type { JsonViewInstance } from '@/types/jsonView';
  // 组件
  import JsonView from '../../components/json/JsonView.vue';
  import { ValidateFieldsError } from 'async-validator';

  const rules: FormRules = {
    'data.enumName': [
      {
        required: true,
        message: '请输入名称',
      },
      {
        max: 50,
        message: '名称不能超过50个字符',
      },
    ],
    'data.enumValue': [
      {
        required: true,
        message: '请输入名称',
      },
      {
        max: 500,
        message: '枚举值不能超过500个字符',
      },
    ],
  };

  const formData = (data?: EnumsManage.Instance): EnumsManage.UpdateAxios => {
    if (data) {
      return {
        replacements: {
          enumId: data.id,
          orgId: data.orgId,
        },
        data: {
          enumCode: data.enumCode,
          enumName: data.enumName,
          enumValue: data.enumValue,
        },
      };
    }
    return {
      replacements: {
        enumId: 0,
        orgId: 0,
      },
      data: {
        enumCode: '',
        enumName: '',
        enumValue: '',
      },
    };
  };

  export default defineComponent({
    name: 'EnumEditDialog',
    components: { JsonView },
    props: {
      visible: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      confirmFn: {
        type: Function as PropType<Function>,
        default: () => {},
      },
      data: {
        type: Object as PropType<EnumsManage.Instance>,
        default: () => {},
      },
    },
    emits: ['update:visible', 'closed'],
    setup(props, { emit }) {
      const jsonViewRef = ref<JsonViewInstance>(null);
      const formRef = ref<ComponentPublicInstance<typeof ElForm>>();
      const state = reactive({
        innerVisible: false,
        form: formData(),
      });
      watch(
        () => props.data,
        (n) => {
          if (n) {
            state.form = formData(props.data);
            setJsonViewValue(props.data.enumValue);
          } else {
            jsonViewRef.value?.setValue();
          }
        },
      );
      const onConfirm = () => {
        const value = jsonViewRef.value?.getValue();
        if (value) {
          state.form.data.enumValue = value;
          formRef.value?.validate((valid: boolean, invalidFields: ValidateFieldsError) => {
            if (!valid) {
              const keys = Object.keys(invalidFields);
              formRef.value?.scrollToField(keys[0]);
            } else {
              const data = cloneDeep(state.form);
              data.data.enumValue = JSON.parse(data.data.enumValue);
              requestV1.enumUpdate(data).then(() => {
                ElMessage.success('更新成功');
                onClosed({ refresh: true });
              });
            }
          });
        } else {
          ElMessage.error({
            message: '未检测到JSON数据',
            type: 'error',
          });
        }
      };
      const onClosed = ({ refresh } = { refresh: false }) => {
        jsonViewRef.value?.setValue();
        emit('update:visible', false);
        emit('closed', { refresh: refresh });
      };
      const setJsonViewValue = (data: Record<string, any> | string) => {
        if (jsonViewRef.value) {
          jsonViewRef.value?.setValue(JSON.stringify(data, undefined, 2));
        } else {
          nextTick(() => {
            setJsonViewValue(data);
          });
        }
      };
      return {
        state,
        props,
        formRef,
        jsonViewRef,
        onClosed,
        onConfirm,
        rules,
      };
    },
  });
</script>
