<template>
  <div class="detail-container account-detail">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>详情</a>
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
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="概览" name="overview">
          <Overview :detail="state.detail" @getOrgsDetail="getOrgsDetail" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Overview from './overview.vue';
  import { ref, reactive, onMounted } from 'vue';
  import { requestV1 } from '@/axios/request';
  import type { SystemData } from '../../../types/apis/systemData';
  import { useRoute } from 'vue-router';

  const activeName = ref('overview');
  const state = reactive({
    detail: undefined as SystemData.Instance | undefined,
    id: 0,
  });

  const handleClick = (tab: string, event: Event) => {
    console.log(tab, event);
  };

  const getOrgsDetail = async () => {
    const { id } = state;
    const response = await requestV1.systemDetail({
      replacements: { id },
    });
    state.detail = response.data;
    console.log('state.detail', state.detail);
  };

  onMounted(() => {
    const route = useRoute();
    state.id = Number(route.query.id);
    getOrgsDetail();
  });
</script>
