<template>
  <div class="account-list-container">
    <List :request-fn="requestV1.whiteLists" :query="query" ref="listRef" :hasSearchBtn="false">
      <template #table>
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="pinType" label="类型" min-width="120px">
          <template #default="scope">
            {{ (scope.row.pinType === 0 && 'ISV') || (scope.row.pinType === 1 && '商家') }}
          </template>
        </el-table-column>
        <el-table-column prop="companyCode" label="企业社会信用代码" min-width="100px" />
        <el-table-column prop="companyName" label="企业名称" min-width="100px" />
        <!-- <el-table-column prop="sysName" label="系统名称" min-width="120px">
        </el-table-column> -->
        <el-table-column prop="appKey" label="AppKey" />
        <el-table-column prop="hasCustomArea" label="是否使用自定义区" width="180px">
          <template #default="scope">
            {{ (scope.row.hasCustomArea === 0 && '否') || (scope.row.hasCustomArea === 1 && '是') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="180px">
          <template #default="scope">
            <el-link :underline="false" type="primary" v-if="+scope.row.status === 0"
              >待审核</el-link
            >
            <el-link :underline="false" type="warning" v-else-if="+scope.row.status === 1"
              >审核未通过</el-link
            >
            <el-link :underline="false" type="success" v-else-if="+scope.row.status === 2"
              >审核通过</el-link
            >
            <el-link :underline="false" v-else-if="+scope.row.status === 3">撤回</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="180px" />
        <el-table-column prop="applyUser" label="申请人" width="180px" />
        <el-table-column prop="applyTime" label="申请时间" width="180px" />
        <el-table-column prop="id" label="操作" width="170px">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleOpenDialog(scope.row)"
              v-if="+scope.row.status === 1 || +scope.row.status === 2"
              >查看</el-button
            >
            <el-button link type="primary" @click="handleOpenDialog(scope.row)" v-else
              >审核</el-button
            >
          </template>
        </el-table-column>
      </template>
    </List>
    <el-dialog
      custom-class="express-create-dialog source-create-dialog"
      @closed="onClosed"
      v-model="state.showDialog"
      center
      title="审核"
      :close-on-click-modal="false"
    >
      <Isv ref="componentRef" v-if="state.templateRow['pinType'] === 0" :row="state.templateRow" />
      <Merchant
        ref="componentRef"
        v-if="state.templateRow['pinType'] === 1"
        :row="state.templateRow"
      />
      <template #footer>
        <template v-if="+state.templateRow['status'] === 1 || +state.templateRow['status'] === 2">
          <el-button @click="onClosed">关闭</el-button>
        </template>
        <template v-else>
          <el-button @click="onReject">不通过</el-button>
          <el-button type="primary" @click="onConfirm">通过</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { ElMessage, ElLoading } from 'element-plus';

  import List from '../../components/List.vue';

  import { requestV1 } from '@/axios/request';

  import Isv from './Isv.vue';
  import Merchant from './Merchant.vue';
  import { WhiteList } from '@/types/apis/examine';

  // 查询条件数据
  const query: WhiteList.ListQueryAxios = reactive({
    params: {
      isPage: 1,
    },
  });
  const rowData = (): WhiteList.Instance | WhiteList.MerchantInstance => {
    return {
      pinType: 0,
      companyCode: '',
      companyName: '',
      sysName: '',
      appKey: '',
      updateTime: '',
      status: 0,
      auditTime: '',
      applyUser: '',
      applyTime: '',
      platformType: 0, // 0：JOS平台 1：京东物流开放平台
      productName: '',
      hasCustomArea: 0,
      companyContact: '',
      companyNumber: '',
      companyMail: '',
      id: 0,
      auditMind: '',
    };
  };
  // data数据
  const state = reactive({
    showDialog: false,
    templateRow: rowData(),
    fetchReviewFlag: true, // 防止重复请求
  });
  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();
  const componentRef = ref<ComponentPublicInstance<typeof Isv | typeof Merchant>>();

  const onClosed = () => {
    state.showDialog = false;
  };
  const onReject = async () => {
    const validate = await componentRef.value?.validateRejectRule();
    validate && fetchReview(1);
  };
  const onConfirm = () => {
    fetchReview(2);
  };
  async function fetchReview(result: number) {
    // result: 1不同意； 2同意
    if (!state.fetchReviewFlag) return;
    const { id, pinType } = state.templateRow;
    const auditMind = componentRef.value?.form().auditMind;
    const loadingInstance = ElLoading.service({
      text: 'loading……',
      background: 'rgba(0,0,0,0.3)',
    });
    const tipMessage = (result === 2 && '审核') || (result === 1 && '驳回');
    try {
      state.fetchReviewFlag = false;
      const { code } = await requestV1.whiteListsReview({
        params: { id, pinType, message: auditMind, result },
      });
      if (code === 200) {
        listRef.value?.getList();
        ElMessage({
          type: 'success',
          message: `${tipMessage}成功`,
        });
      } else {
        ElMessage({
          type: 'error',
          message: `${tipMessage}失败`,
        });
      }
    } catch (err) {
      ElMessage({
        type: 'error',
        message: `${tipMessage}失败`,
      });
    }
    state.fetchReviewFlag = true;
    state.showDialog = false;
    loadingInstance.close();
  }
  const handleOpenDialog = (row: WhiteList.Instance | WhiteList.Instance) => {
    state.showDialog = true;
    componentRef.value?.resetFieldsFn();
    state.templateRow = row;
  };
</script>
<script lang="ts">
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
  import { ComponentPublicInstance } from 'vue';
  export default {
    name: 'WhiteList',
    beforeRouteEnter(
      to: RouteLocationNormalized,
      form: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) {
      next(
        (
          vm: ComponentPublicInstance & {
            getSystem?: (needGetList: boolean) => void;
            resetQuery?: Function;
          },
        ) => {
          if (vm.getSystem && vm.resetQuery) {
            vm.getSystem(false);
            vm.resetQuery();
          }
        },
      );
    },
  };
</script>
