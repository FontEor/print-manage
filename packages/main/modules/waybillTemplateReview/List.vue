<template>
  <div class="template-list-wrap">
    <List ref="listRef" :request-fn="requestFn" :query="query" @reset-query="resetQuery">
      <!-- 查询 开始 -->
      <template #form>
        <el-form-item
          class="width-adjustment width-fixed"
          label-width="120px"
          label="审核状态"
          prop="title"
        >
          <el-select
            v-model="query.params.status"
            value-key="id"
            placeholder="请选择审核状态"
            size="large"
            clearable
            class="w100p"
          >
            <el-option
              v-for="item in reviewStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="width-adjustment width-fixed"
          label-width="120px"
          label="模板编码/名称"
          prop="title"
        >
          <el-input
            v-model="query.params.nameOrCode"
            class="list-search_item"
            placeholder="请输入模板编码/模板名称"
          />
        </el-form-item>
        <el-form-item
          class="width-adjustment width-fixed"
          label-width="120px"
          label="发布人ERP账号"
          prop="title"
        >
          <el-input
            v-model="query.params.createUser"
            class="list-search_item"
            placeholder="请输入发布人ERP账号"
          />
        </el-form-item>
      </template>
      <template #notification>
        <el-alert type="warning" :closable="false" class="mb-12 text-left">
          <template #title>
            本页面可以查看申请单详情，审批需要到流程中心进行审批。移动端审批位置：【京ME-流程中心】；PC端审批位置：【ERP-流程中心】<el-link
              type="primary"
              :underline="false"
              href="http://oa.jd.com/home/#/"
              target="_blank"
              >http://oa.jd.com/home/#/></el-link
            >
          </template>
        </el-alert>
      </template>
      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="模板编码" prop="code" min-width="120" />
        <el-table-column label="模板名称" prop="name" min-width="120" />
        <el-table-column label="发布人" prop="createUser" min-width="120" />
        <el-table-column label="发布时间" prop="createTime" min-width="220" />
        <el-table-column label="审核状态" prop="status" min-width="120" />
        <el-table-column label="审核人" prop="reviewer" min-width="220" />
        <el-table-column label="审核时间" prop="reviewTime" min-width="220" />
        <el-table-column fixed="right" label="操作" width="80px">
          <template #default="scope">
            <el-link :underline="false" type="primary" @click="onDetail(scope.row)">详情</el-link>
          </template>
        </el-table-column>
      </template>
    </List>
    <DetailDialog
      :visible="state.detailDialogVisible"
      :data="state.detail"
      @close="state.detailDialogVisible = false"
      @open="state.detailDialogVisible = true"
      @success="handleRefreshList"
    />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, UnwrapNestedRefs, ref, ComponentPublicInstance } from 'vue';
  import DetailDialog from './Detail.vue';
  import { requestV2 } from '@/axios/request';
  import List from '../../components/ListNew.vue';
  import { WaybillTemplateReview } from '@/types/apis/waybill-template-review';
  import { reviewStatus } from '@/enums/reviewStatus';

  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const state = reactive({
    tableData: [] as WaybillTemplateReview.Instance[],
    detailDialogVisible: false,
    detail: undefined as WaybillTemplateReview.Detail | undefined,
  });

  const query: UnwrapNestedRefs<WaybillTemplateReview.ListAxios> = reactive({
    params: {
      status: undefined,
      nameOrCode: '',
      createUser: '',
    },
  });

  const resetQuery = () => {
    query.params = {
      status: undefined,
      nameOrCode: '',
      createUser: '',
    };
  };

  const requestFn = requestV2.waybillTemplateReviewList;

  const handleRefreshList = () => {
    if (listRef.value) {
      listRef.value.getList();
    }
  };
  const onDetail = (data: WaybillTemplateReview.Instance) => {
    requestV2.waybillTemplateReviewDetail({ replacements: { id: data.id } }).then((res) => {
      state.detail = res.data;
      state.detailDialogVisible = true;
    });
  };
</script>
