<template>
  <div class="detail-container template-manage-wrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="'SourcesNew'">数据源</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        state.currentTab === 'summary' ? '基础信息' : '数据模型'
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="template-manage-content">
      <div class="template-manage-info">
        <div class="template-manage-left">
          <span class="template-name">
            {{ state.detail?.name }}
          </span>
          <span class="template-code cursor-pointer" @click="handleCopy(state.detail?.code || '')">
            <span>{{ state.detail?.code }}</span>
            <i class="jdl-icon-document-copy manage-copy-icon"></i>
          </span>
        </div>
        <div class="template-manage-right"></div>
      </div>
      <el-tabs v-model="state.currentTab" class="template-detail-tabs">
        <el-tab-pane name="summary" label="基础信息">
          <Summary :detail="state.detail" @get-detail="getDetail" />
        </el-tab-pane>
        <el-tab-pane name="data" label="数据模型" class="flex-column-start">
          <DataTab :detail="state.detail" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, PropType, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import type { SourceNew } from '@/types/apis/source-new';
  import { requestV2 } from '@/axios/request';

  import Summary from './tabs/Summary.vue';
  import DataTab from './tabs/Data.vue';

  import { copyFn } from '@/hooks/copy';
  const handleCopy = (text: string) => copyFn(text);

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
    detail: undefined as SourceNew.Instance | undefined,
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
    requestV2
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
