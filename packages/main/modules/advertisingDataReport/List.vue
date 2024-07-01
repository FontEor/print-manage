<template>
  <div class="template-list-wrap advertisement-report-list">
    <List ref="listRef" :request-fn="requestFn" :query="query" @reset-query="resetQuery">
      <!-- 查询 开始 -->
      <template #form>
        <el-form-item
          class="width-adjustment width-fixed"
          label-width="200px"
          label="日期（下单日期/打单日期）"
        >
          <el-date-picker
            v-model="query.params.categories"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item class="width-adjustment width-fixed" label="商家pin" prop="codeOrName">
          <el-input
            v-model="query.params.codeOrName"
            class="list-search_item"
            placeholder="如：京东云打印专卖店"
          />
        </el-form-item>
        <el-form-item label="承运商" prop="sourceId">
          <el-select v-model="query.params.sourceId" placeholder="请选择承运商" clearable>
            <el-option
              v-for="item in state.deliveryCodeOptions"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}`"
            />
          </el-select>
        </el-form-item>
      </template>

      <template #action>
        <div class="report-info">
          <div class="report-title"> 总计 </div>
          <div class="report-content-level1">
            <div class="report-content-item">
              <div class="content-item-label"> 广告渗透率=广告打印量/云打印打印量： </div>
              <div class="content-item-value"> 75% </div>
            </div>
            <div class="report-content-item">
              <div class="content-item-label"> 云打印渗透率=云打印打印量/POP发货量： </div>
              <div class="content-item-value"> 80% </div>
            </div>
          </div>
          <div class="report-content-level2">
            <div class="report-content-item">
              <div class="content-item-label"> POP发货量： </div>
              <div class="content-item-value"> 10000 </div>
            </div>
            <div class="report-content-item">
              <div class="content-item-label"> 云打印打印量： </div>
              <div class="content-item-value"> 8000 </div>
            </div>
            <div class="report-content-item">
              <div class="content-item-label"> 广告打印量： </div>
              <div class="content-item-value"> 6000 </div>
            </div>
          </div>

          <div class="report-action">
            <div class="report-title"> 明细 </div>
            <el-button class="report-export" type="primary">导出明细</el-button>
          </div>
        </div>
      </template>

      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="日期（下单日期/打印日期）" prop="code" width="280" />
        <el-table-column label="商家pin" prop="name" width="170" />
        <el-table-column label="商家ID" prop="updateUser" width="170" />
        <el-table-column label="承运商" prop="updateTime" width="230" />
        <el-table-column label="POP发货量" prop="createUser" width="170" />
        <el-table-column label="云打印打印量" prop="createTime" width="220" />
        <el-table-column label="广告打印量" prop="createTime" width="220" />
        <el-table-column fixed="right" label="操作" width="80px">
          <template #default="scope">
            <el-link :underline="false" type="primary" @click="handleSwitchPage(scope.row)"
              >编辑
            </el-link>
          </template>
        </el-table-column>
      </template>
    </List>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, UnwrapNestedRefs, ref, ComponentPublicInstance } from 'vue';
  import { requestV2 } from '@/axios/request';
  import { Session } from '@/utils/session';
  import { TemplateNew } from '@/types/apis/template-new';
  import selectListMixins from '../../mixins/selectList';
  import List from '../../components/ListNew.vue';

  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const state = reactive({
    tableData: [] as TemplateNew.Instance[],
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    createBlankTemplateVisible: false,
    whiteListDialogVisible: false,
    query: {} as TemplateNew.SearchData,
  });
  const query: UnwrapNestedRefs<TemplateNew.ListWebAxios> = reactive({
    params: {
      sourceId: '',
      orgId: Session.getOrgId(),
      codeOrName: '',
      categories: [],
      tags: [],
      height: undefined,
      width: undefined,
    },
  });

  const resetQuery = () => {
    query.params = {
      orgId: Session.getOrgId(),
      codeOrName: '',
      categories: [],
      tags: [],
      height: undefined,
      width: undefined,
    };
  };

  const { getCategoryList, getTempListAndRelationTemplateTagList, getDeliveryList } =
    selectListMixins(state);

  const requestFn = requestV2.templateList;

  const handleRefreshList = () => {
    if (listRef.value) {
      listRef.value.getList();
    }
  };

  onMounted(() => {
    getCategoryList();
    getTempListAndRelationTemplateTagList();
    getDeliveryList();
  });
</script>
