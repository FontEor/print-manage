<template>
  <el-dialog
    width="440px"
    custom-class="express-create-dialog source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="设置调用pullData接口时失败概率"
    :close-on-click-modal="false"
  >
    <el-form :inline="true" ref="form" :model="state.form" :rules="rules" label-width="120px">
      <el-form-item label="概率值" prop="value">
        <el-input-number v-model="state.form.value" :min="0" :max="100" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button type="default" @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, onMounted } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType, watch } from 'vue';
  import type { FormRules } from 'element-plus';
  import { requestV1 } from '@/axios/request';

  import { VERSION_REGEXP } from '../../../const/regexp';
  import { PluginForceUpdate } from '../../../types/apis/plugin';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    value: [
      {
        required: true,
        message: '请输入概率值',
      },
    ],
  };

  const state = reactive({
    visible: true,
    form: {
      value: 10,
    },
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    data: {
      type: Object as PropType<PluginForceUpdate.Instance[]>,
    },
  });

  const emits = defineEmits(['closed']);

  watch(
    () => props.visible,
    (n) => {
      if (n && props.data && props.data[0] && props.data[0].percentage !== state.form.value) {
        state.form.value = props.data[0].percentage;
      }
    },
  );

  const onClosed = ({ refresh }: { refresh: boolean } = { refresh: false }) => {
    state.form.value = 10;
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
      requestV1
        .pluginSetSuccessPercentage({
          data: {
            percentage: data.value,
            pins: (props.data || []).map((data) => data.pin),
          },
        })
        .then(() => {
          ElMessage.success('保存成功');
          onClosed({ refresh: true });
        });
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'UpgradeFailDialog',
  };
</script>
