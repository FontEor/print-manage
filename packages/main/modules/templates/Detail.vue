<template>
  <div class="detail-container template-manage-wrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="'TemplateManage'">模板</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        state.activeName === 'overview' ? '基础信息' : '版本管理'
      }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="template-manage-content">
      <div class="template-manage-info">
        <div class="template-manage-left">
          <span class="template-name">
            {{ state.detail.name }}
          </span>
          <span class="template-code cursor-pointer" @click="handleCopy(state.detail?.code || '')">
            <span>{{ state.detail?.code }}</span>
            <i class="jdl-icon-document-copy manage-copy-icon"></i>
          </span>
        </div>
        <div v-if="isOwner" class="template-manage-right">
          <CancelShareButton
            v-if="state.detail.shared"
            :data="state.detail"
            @refresh="getTemplateDetail"
          />
          <ShareButton v-else type="button" :data="state.detail" @refresh="getTemplateDetail" />
        </div>
      </div>
      <el-tabs class="template-detail-tabs" v-model="state.activeName">
        <el-tab-pane label="基础信息" name="overview">
          <Overview :code="state.detail.code" :allow-edit="isOwner" />
        </el-tab-pane>
        <el-tab-pane label="版本管理" name="versionManagement">
          <VersionManagement
            v-if="state.code"
            :code="state.code"
            :type="state.type"
            :id="state.id"
            :isOwner="isOwner"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Overview from '../../components/templates/Overview.vue';
  import VersionManagement from '../../components/templates/VersionManagement.vue';
  import { reactive, onMounted, watch, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { TemplateNew } from '@/types/apis/template-new';
  import { copyFn } from '@/hooks/copy';
  import { router } from '@/router';
  import { requestV2 } from '@/axios/request';
  import { Session } from '@/utils/session';
  import { ElMessage } from 'element-plus';
  import { useStore } from '@/store';
  import { Store } from 'vuex';
  import RootStateTypes from '@/types/store';
  import CancelShareButton from './components/CancelShareButton.vue';
  import ShareButton from '@/modules/templates/components/ShareButton.vue';

  const route = useRoute();

  const store: Store<RootStateTypes> = useStore();
  const currentOrgIdByStore = computed(() => store.state.currentOrgId);

  const state = reactive({
    code: '',
    type: 1 as TemplateNew.TypeStatusKeys,
    id: '',
    hasTemplateProvider: false,
    activeName: 'overview',
    detail: {} as TemplateNew.ListInstance,
    showSuccessDialog: false,
    showOfflineDialog: false,
    showOfflineSuccessDialog: false,
    showOnlineDialog: false,
  });

  const isOwner = computed(() => {
    return currentOrgIdByStore.value && currentOrgIdByStore.value === Number(state.detail.orgId);
  });

  const rules = {
    reason: [
      {
        required: true,
        message: '请输入发布原因',
        trigger: 'blur',
      },
      {
        min: 1,
        max: 50,
        message: '发布原因长度在1到50个字符',
        trigger: 'blur',
      },
    ],
  };

  const formData = reactive({
    reason: '',
  });

  const getTemplateDetail = async () => {
    const code = route.query.templateCode as string;
    if (code) {
      const response = await requestV2.templateDetail({
        replacements: {
          orgId: Session.getOrgId(),
          code: code,
        },
      });
      state.detail = response.data;
    } else {
      await router.replace({
        name: 'TemplateManage',
      });
    }
  };

  const handleOnline = () => {
    requestV2
      .templateShare({
        params: {
          id: state.detail.id,
          type: state.detail.type,
          orgId: state.detail.orgId,
        },
      })
      .then(() => {
        ElMessage.success('分享成功');
        state.showOnlineDialog = false;
        formData.reason = '';
        getTemplateDetail();
        state.showSuccessDialog = true;
      });
  };

  const handleCloseOfflineDialog = () => {
    state.showOfflineSuccessDialog = false;
    state.showOfflineDialog = false;
  };
  const handleCopy = (text: string) => copyFn(text);

  watch(
    () => state.activeName,
    (val: string) => {
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
  watch(
    () => route.query,
    (newQuery, oldQuery) => {
      if (newQuery !== oldQuery) {
        console.log('newQuery', newQuery);
      }
    },
    {
      immediate: true,
    },
  );

  onMounted(() => {
    state.activeName = 'versionManagement';
    state.code = route.query.templateCode as string;
    state.type = Number(route.query.templateType) as TemplateNew.TypeStatusKeys;
    state.id = route.query.templateId as string;
    getTemplateDetail();
  });
</script>
