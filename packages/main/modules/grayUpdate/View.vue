<template>
  <el-dialog
    width="530px"
    class="source-create-dialog left-footer-buttons form-item-label-bold"
    @closed="onClosed"
    v-model="state.visible"
    title="灰度投放策略"
    center
    :close-on-click-modal="false"
  >
    <el-form
      class="horizontal-form"
      :inline="true"
      ref="formRef"
      label-width="120px"
    >
      <el-form-item label="策略名称" prop="name">
        <p>{{ props.data.name }}</p>
      </el-form-item>
      <el-form-item label="灰度组件版本" prop="version">
        <p>{{ props.data.version }}</p>
      </el-form-item>
      <el-form-item label="投放范围" prop="type">
        <p>{{ strategyTypeEnum[props.data.upgradeType] }}</p>
      </el-form-item>
      <el-form-item v-if="props.data.upgradeType === 1" label="放量比例" prop="type">
        <p>{{ props.data.upgradeValue }}%</p>
      </el-form-item>
      <el-form-item v-else-if="props.data.upgradeType === 2" label="appKey" prop="type">
        <p class="mh-300 scroll-y break-all">{{ props.data.upgradeValue }}</p>
      </el-form-item>
      <el-form-item v-else-if="props.data.upgradeType === 3" label="pin" prop="type">
        <p class="mh-300 scroll-y break-all">{{ props.data.upgradeValue }}</p>
      </el-form-item>
      <el-form-item v-else-if="props.data.upgradeType === 4" label="机器ID" prop="type">
        <p class="mh-300 scroll-y break-all">{{ props.data.upgradeValue }}</p>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClosed">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, defineProps, watch } from 'vue';
  import { ElForm } from 'element-plus';
  import { PropType } from 'vue';
  import { strategyTypeEnum } from '@/enums/strategy';
  import { GrayUpgradeStrategy } from "@/types/apis/gray-upgrade-strategy";

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    data: {
      type: Object as PropType<GrayUpgradeStrategy.Instance>,
      default: () => ({}),
    }
  });

  const state = reactive({
    visible: false,
  });

  watch(
      () => props.visible,
      (n) => {
        state.visible = n;
      },
      {
        immediate: true,
      },
  );

  const emits = defineEmits(['closed']);

  const onClosed = () => {
    emits('closed');
  };
</script>
