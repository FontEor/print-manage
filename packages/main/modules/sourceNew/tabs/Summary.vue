<template>
  <el-form
    class="detail-from"
    :class="{
      'detail-form-view': state.disabled,
    }"
    ref="ruleFormRef"
    :model="state.form"
    :rules="state.rules"
    label-width="125px"
    :disabled="state.disabled"
  >
    <el-form-item label="数据源编码：" prop="code">
      <p>{{ props.detail?.code }}</p>
    </el-form-item>
    <el-form-item label="数据源名称：" prop="data.name" required>
      <p v-if="state.disabled">{{ props.detail?.name }}</p>
      <el-input v-else v-model="state.form.data.name" />
    </el-form-item>
    <!-- Look: 下期做 -->
    <!-- <el-form-item label="数据源负责人：" prop="data.commander" required>
      <p v-if="state.disabled">{{ props.detail?.commander }}</p>
      <el-input v-else v-model="state.form.data.commander" />
    </el-form-item> -->
    <el-form-item label="数据源说明：" prop="data.remark">
      <p v-if="state.disabled">{{ props.detail?.remark }}</p>
      <el-input v-else v-model="state.form.data.remark" type="textarea" />
    </el-form-item>
    <el-form-item v-if="!state.disabled">
      <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      <el-button @click="resetForm(ruleFormRef)">取消</el-button>
    </el-form-item>
  </el-form>
  <el-form v-show="state.disabled" label-width="120px">
    <el-form-item class="text-left">
      <el-button type="primary" @click="onEdit">编辑</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive, ref, defineProps } from 'vue';

  import { PropType, watch } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import type { FormRules } from 'element-plus';

  import type { SourceNew } from '@/types/apis/source-new.d';
  import { requestV2 } from '@/axios/request';

  type FormInstance = InstanceType<typeof ElForm>;
  const ruleFormRef = ref<FormInstance>();

  const props = defineProps({
    detail: {
      type: Object as PropType<SourceNew.Instance>,
    },
  });

  const formData = (): SourceNew.ChangeDataAxios => ({
    data: {
      name: '',
      commander: '',
      remark: '',
    },
    replacements: {
      id: undefined,
      sourceId: '',
    },
  });

  const rules: FormRules = {
    'data.name': [
      {
        required: true,
        message: '请输入数据源名称',
      },
      {
        min: 2,
        max: 50,
        message: '数据源名称长度应为：2-50个字符',
      },
    ],
    // Look: 下期做
    // 'data.commander': [
    //   {
    //     required: true,
    //     message: '请输入数据源负责人',
    //   },
    //   {
    //     pattern: CN_EN_NUM,
    //     message: '支持中英文字符、阿拉伯数字，不得超过50个字符',
    //   },
    //   {
    //     min: 0,
    //     max: 50,
    //     message: '不得超过50个字符',
    //   },
    // ],
    'data.remark': [
      {
        required: true,
        message: '请输入数据源说明',
      },
      {
        min: 10,
        max: 100,
        message: '数据源说明应大于等于10个字符并不得超过100个字符',
      },
    ],
  };

  const state = reactive({
    disabled: true,
    form: formData(),
    rules: rules,
  });

  const pickData = (detail: SourceNew.Instance | undefined) => {
    if (detail) {
      state.form.data.name = detail.name;
      state.form.data.remark = detail.remark;
      state.form.replacements.id = detail.orgId;
      state.form.replacements.sourceId = `${detail.id}`;
    }
  };

  watch(
    () => props.detail,
    (n) => {
      if (n) {
        pickData(n);
      } else {
        state.form = formData();
      }
    },
    {
      immediate: true,
    },
  );

  const emits = defineEmits(['getDetail']);

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
      if (valid) {
        requestV2.sourceUpdate(state.form).then(() => {
          ElMessage.success('保存成功');
          state.disabled = true;
          emits('getDetail');
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
    state.disabled = true;
  };

  const onEdit = () => {
    state.disabled = !state.disabled;
  };
</script>

<style></style>
