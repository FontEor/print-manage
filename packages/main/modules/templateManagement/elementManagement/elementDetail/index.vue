<template>
  <div class="detail-container account-detail">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/openTemplate' }">模板管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>要素管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-container-info-bar">
      <h1>{{ state.detail?.name }}</h1>
      <p v-if="state.detail?.updateUser"
        >{{ state.detail?.updateUser }} 更新于 {{ state.detail?.updateTime }}</p
      >
      <p v-else>{{ state.detail?.createUser }} 创建于 {{ state.detail?.createTime }}</p>
    </div>
    <div class="detail-tabs">
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="概览" name="overview">
          <Overview :detail="state.detail" @getElementDetail="getElementDetail" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Overview from './overview.vue';
  import { reactive, onMounted, watch } from 'vue';
  import { requestV1 } from '@/axios/request';
  import type { elementData } from '../../../../types/apis/elementData';
  import { useRoute } from 'vue-router';
  import { router } from '../../../../router';

  const state = reactive({
    activeName: 'overview',
    detail: undefined as elementData.Instance | undefined,
    elementId: 0,
  });

  const getElementDetail = async () => {
    const { elementId } = state;
    const response = await requestV1.elementDetail({
      replacements: { elementId },
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
    state.elementId = Number(route.query.elementId);
    getElementDetail();
  });
</script>
