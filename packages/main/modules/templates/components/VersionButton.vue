<template>
  <template v-if="currentOrgIdByStore === props.row.orgId">
    <el-link
      :underline="false"
      :disabled="props.row.orgId !== currentOrgIdByStore"
      type="primary"
      @click="switchPage(props.row)"
      >版本管理
    </el-link>
  </template>
  <template v-else>
    <el-tooltip
      class="box-item"
      effect="dark"
      content="因为模板提供方不是当前登录的系统，所以你无法对模板版本进行管理操作"
      placement="top-start"
    >
      <el-link
        :underline="false"
        :disabled="props.row.orgId !== props.currentOrgIdByStore"
        type="primary"
        @click="switchPage(props.row)"
        >版本管理
      </el-link>
    </el-tooltip>
  </template>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import type { TemplateNew } from '@/types/apis/template-new';
  export default defineComponent({
    name: 'VersionButton',
    props: {
      row: {
        type: Object as PropType<TemplateNew.Instance>,
        default: () => {},
      },
      currentOrgIdByStore: {
        type: Number as PropType<Number>,
        default: 0,
      },
    },
    emits: ['switch-page'],
    setup(props, { emit }) {
      function switchPage(row: TemplateNew.Instance) {
        emit('switch-page', row);
      }
      return {
        props,
        emit,
        switchPage,
      };
    },
  });
</script>
