<template>
  <el-dialog
    width="440px"
    custom-class="express-create-dialog source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="批量导入商家"
    :close-on-click-modal="false"
  >
    <el-form :inline="true" ref="form" :model="state.form" :rules="rules" label-width="120px">
      <el-form-item label="商家PIN" prop="pin">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="多个PIN用英文逗号隔开"
          v-model="state.form.pin"
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
  import { reactive, ref, ComponentPublicInstance, onMounted } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType, watch } from 'vue';
  import type { FormRules } from 'element-plus';
  import { requestV1 } from '@/axios/request';

  import { VERSION_REGEXP } from '../../../const/regexp';
  import { PluginVersion } from '../../../types/apis/plugin';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    pin: [
      {
        required: true,
        message: '请输入商家PIN',
      },
    ],
  };

  const state = reactive({
    visible: true,
    form: {
      pin: '',
    },
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    data: {
      type: Object as PropType<PluginVersion.Instance>,
    },
  });

  const emits = defineEmits(['closed']);

  const onClosed = ({ refresh }: { refresh: boolean } = { refresh: false }) => {
    state.form.pin = '';
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
        .pluginImportPins({
          data: {
            pins: data.pin,
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
    name: 'UpgradeImportDialog',
  };
</script>
