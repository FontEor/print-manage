<template>
  <el-dialog
    width="530px"
    custom-class="source-create-dialog"
    @closed="onClosed"
    v-model="props.visible"
    title="新建数据源"
    center
    :close-on-click-modal="false"
  >
    <el-form :inline="true" ref="form" :model="state.form" :rules="rules" label-width="120px">
      <el-form-item label="数据源编码" prop="data.code">
        <el-input placeholder="请输入数据源唯一编码" v-model="state.form.data.code" />
      </el-form-item>
      <el-form-item label="数据源名称" prop="data.name">
        <el-input placeholder="请输入数据源名称" v-model="state.form.data.name" />
      </el-form-item>
      <el-form-item label="数据源说明" prop="data.remark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="可填写数据源描述或用途，以便其他用户快速了解"
          v-model="state.form.data.remark"
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
  import { ElForm, ElMessage } from 'element-plus';
  import { clone } from 'lodash';
  import { nextTick, PropType } from 'vue';
  import type { FormRules } from 'element-plus';
  import { requestV1 } from '@/axios/request';

  import { SourceData } from '../../types/apis/sourceData';
  import { EN_NUM, CN_EN_NUM } from '../../const/regexp';
  import { Session } from '../../utils/session';

  const form = ref<ComponentPublicInstance<typeof ElForm>>();
  const rules: FormRules = {
    'data.code': [
      {
        required: true,
        message: '请输入数据源编码',
      },
      {
        pattern: EN_NUM,
        message: '支持英文字符大小写及阿拉伯数字，不得超过50个字符',
      },
      {
        min: 0,
        max: 50,
        message: '不得超过50个字符',
      },
    ],
    'data.name': [
      {
        required: true,
        message: '请输入数据源名称',
      },
      {
        pattern: CN_EN_NUM,
        message: '支持中英文字符、阿拉伯数字，不得超过50个字符',
      },
      {
        min: 0,
        max: 50,
        message: '不得超过50个字符',
      },
    ],
    'data.remark': [
      {
        required: true,
        message: '请输入数据源名称',
      },
      {
        min: 0,
        max: 100,
        message: '不得超过100个字符',
      },
    ],
  };

  const formData = (): SourceData.CreateAxios => ({
    data: {
      code: '',
      jsonString: null,
      name: '',
      remark: '',
    },
    replacements: {
      id: Session.getOrgId(),
    },
  });

  const state = reactive({
    visible: true,
    form: formData(),
  });

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  });

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
      requestV1.sourceCreate(data).then(() => {
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
