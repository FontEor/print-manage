<template>
  <el-dialog
    width="530px"
    class="source-create-dialog left-footer-buttons"
    @closed="onClosed"
    v-model="state.visible"
    title="配置灰度投放策略"
    center
    :close-on-click-modal="false"
  >
    <el-form
      class="horizontal-form"
      :inline="true"
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="策略名称" prop="name">
        <el-input placeholder="请输入" v-model="formData.name" />
      </el-form-item>
      <el-form-item label="灰度组件版本" prop="version">
        <el-input
          placeholder="请输入需要灰度验证的组件版本号,示例:3.4.6.1"
          v-model="formData.version"
        />
      </el-form-item>
      <el-form-item label="投放范围" prop="upgradeType">
        <el-select
          v-model="formData.upgradeType"
          placeholder="请选择投放范围"
          value-key="id"
          class="w100p"
          clearable
        >
          <el-option
            v-for="item in strategyTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.upgradeType === 1"
        label="放量比例"
        prop="percentage"
        :rules="otherRules.percentage"
      >
        <el-input
          placeholder="填写百分比(0%＜比例≤50%),示例:10%"
          v-model.number="formData.percentage"
        >
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-else-if="formData.upgradeType === 2"
        label="appKey"
        prop="appKey"
        :rules="otherRules.appKey"
      >
        <el-input
          type="textarea"
          row="3"
          v-model="formData.appKey"
          placeholder="多个appKey之间用英文逗号隔开"
        />
      </el-form-item>
      <el-form-item v-else-if="formData.upgradeType === 3" label="PIN" prop="pin" :rules="otherRules.pin">
        <el-input
          type="textarea"
          row="3"
          v-model="formData.pin"
          placeholder="多个pin之间用英文逗号隔开"
        />
      </el-form-item>
      <el-form-item
        v-else-if="formData.upgradeType === 4"
        label="机器ID"
        prop="machineId"
        :rules="otherRules.machineId"
      >
        <el-input
          type="textarea"
          row="3"
          v-model="formData.machineId"
          placeholder="多个机器ID之间用英文逗号隔开"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onConfirm">保存</el-button>
      <el-button @click="onClosed">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, ComponentPublicInstance, defineProps, watch } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import { nextTick, PropType } from 'vue';
  import { requestV2 } from '@/axios/request';
  import { rules, otherRules } from './rules';
  import { GrayUpgradeStrategy } from '@/types/apis/gray-upgrade-strategy';
  import { strategyTypes } from '@/enums/strategy';
  import {formatValue} from "@/modules/grayUpdate/format";

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  });

  const formRef = ref<ComponentPublicInstance<typeof ElForm>>();

  const initFormData = (): GrayUpgradeStrategy.CreateData => ({
    name: '',
    version: '',
    upgradeType: 1,
    percentage: undefined,
    appKey: '',
    pin: '',
    machineId: '',
    upgradeValue: '',
  });

  const formData = reactive(initFormData());

  const state = reactive({
    visible: true,
  });

  watch(
    () => props.visible,
    (n) => {
      state.visible = n;
      if (n) {
        formRef.value?.clearValidate();
      }
    },
    {
      immediate: true,
    },
  );

  const emits = defineEmits(['closed', 'confirm']);

  const onClosed = () => {
    Object.assign(formData, initFormData());
    nextTick(() => {
      formRef.value?.clearValidate();
    });
    emits('closed');
  };

  const onConfirm = () => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) {
        const upgradeValue = formatValue(formData);
        requestV2.grayUpgradeCreate({
          data: {
            ...formData,
            upgradeValue: upgradeValue,
          },
        }).then(() => {
          emits('confirm');
          emits('closed');
          ElMessage.success('创建成功');
        });
      }
    });
  };
</script>
