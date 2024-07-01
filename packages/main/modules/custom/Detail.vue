<template>
  <div class="detail-container account-detail">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/openTemplate' }">模板管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>半自定义模板</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-container-info-bar">
      <h1>{{ state.detail?.name }}（{{ state.detail?.code }}）</h1>
      <p v-if="state.detail?.updateUser"
        >{{ state.detail?.updateUser }} 更新于 {{ state.detail?.updateTime }}</p
      >
      <p v-else>{{ state.detail?.createUser }} 创建于 {{ state.detail?.createTime }}</p>
    </div>
    <div class="detail-tabs">
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="概览" name="overview">
          <Overview :detail="state.detail" @getTemplateDetail="getTemplateDetail" />
        </el-tab-pane>
        <el-tab-pane label="版本管理" name="versionManagement">
          <VersionManagement :detail="state.detail" @getTemplateDetail="getTemplateDetail" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Overview from './Overview.vue';
  import VersionManagement from './VersionManagement.vue';
  import { reactive, onMounted, watch, PropType } from 'vue';
  import { requestV1 } from '@/axios/request';
  import type { openTemplateData } from '../../types/apis/openTemplateData';
  import { useRoute } from 'vue-router';
  import { router } from '../../router';
  import { Custom } from '../../types/apis/custom';

  const state = reactive({
    activeName: 'overview',
    detail: undefined as Custom.Instance | undefined,
    id: 0,
    temId: 0,
  });

  const props = defineProps({
    id: {
      type: String as PropType<string>,
      default: '',
    },
    temId: {
      type: String as PropType<string>,
      default: '',
    },
  });

  const getTemplateDetail = async () => {
    const response = await requestV1.customDetail({
      replacements: {
        temId: props.temId,
      },
    });
    state.detail = response.data;
  };

  watch(
    () => state.activeName,
    (val) => {
      const route = router.currentRoute.value;
      router.replace({
        path: route.path,
        query: {
          ...route.query,
          tag: val,
        },
      });
    },
  );

  onMounted(() => {
    const route = useRoute();
    state.activeName = (route.query.tag || 'overview') as string;
    getTemplateDetail();
  });
</script>
