<template>
  <div class="detail-container account-detail disabled-form">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/sources' }">数据源管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        state.currentTab === 'summary' ? '数据概览' : '数据模型'
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-container-info-bar">
      <h1>{{ state.detail?.name }}（{{ state.detail?.code }}）</h1>
      <p v-if="state.detail?.updateUser">
        {{ state.detail?.updateUser }}更新于{{ state.detail?.updateTime }}
      </p>
      <p v-else>{{ state.detail?.createUser }}创建于{{ state.detail?.createTime }}</p>
    </div>
    <div class="detail-container-tab-container">
      <el-tabs v-model="state.currentTab">
        <el-tab-pane name="summary" label="概览">
          <Summary :detail="state.detail" @getDetail="getDetail" />
        </el-tab-pane>
        <el-tab-pane name="data" label="数据模型">
          <Data :detail="state.detail" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, PropType, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { SourceData } from '../../types/apis/sourceData';
  import { requestV1 } from '@/axios/request';

  import Summary from './tabs/Summary.vue';
  import Data from './tabs/Data.vue';

  const router = useRouter();
  const route = useRoute();

  const props = defineProps({
    id: {
      type: String as PropType<string>,
      default: '',
    },
    sourceId: {
      type: String as PropType<string>,
      default: '',
    },
  });

  const state = reactive({
    currentTab: 'summary',
    detail: undefined as SourceData.Instance | undefined,
  });

  onMounted(() => {
    state.currentTab = (route.query.tag || 'summary') as string;
    getDetail();
  });

  watch(
    () => state.currentTab,
    (n) => {
      router.replace({
        path: route.path,
        query: {
          ...route.query,
          tag: n,
        },
      });
    },
  );

  const getDetail = () => {
    requestV1
      .sourceDetail({
        replacements: {
          id: props.sourceId,
          sourceId: props.id,
        },
      })
      .then((response) => {
        state.detail = response.data;
      });
  };
</script>

<style></style>
