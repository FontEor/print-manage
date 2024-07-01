<template>
  <div class="template-list-wrap">
    <List ref="listRef" :request-fn="requestFn" :query="query" @reset-query="resetQuery">
      <!-- 查询 开始 -->
      <template #form>
        <el-form-item
          class="width-adjustment width-fixed"
          label-width="80px"
          label="计划标题"
          prop="codeOrName"
        >
          <el-input
            v-model="query.params.title"
            class="list-search_item"
            placeholder="输入计划标题的关键字，如：6.18"
          />
        </el-form-item>
        <el-form-item
          class="width-adjustment width-fixed"
          label-width="120px"
          label="投放时间范围"
          style="width: 480px"
        >
          <el-date-picker
            v-model="query.params.timeRange"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
            date-format="YYYY-MM-DD"
            time-format="HH:mm"
            :default-time="defaultTime"
          />
        </el-form-item>
      </template>
      <template #action>
        <p class="template-list-btn">
          <el-button
            class="template-list-btn-market"
            type="info"
            @click="state.whiteListDialogVisible = true"
            >商家白名单
          </el-button>
          <el-button
            class="template-list-btn-new-template"
            type="primary"
            @click="state.createDialogVisible = true"
            >新建广告计划
          </el-button>
        </p>
      </template>
      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="序号" prop="idx" width="80" />
        <el-table-column label="计划标题" prop="title" min-width="160" />
        <el-table-column label="投放时间范围" prop="startTime" min-width="360">
          <template #default="scope">
            {{ scope.row.startTime }} ~ {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="image" width="100">
          <template #default="scope">
            <el-image
              style="width: 50px; height: 50px"
              v-if="scope.row.image"
              :src="scope.row.image"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[scope.row.image]"
              :initial-index="0"
              :z-index="9999"
              :preview-teleported="true"
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    src="https://storage.jd.com/print-images/no-cover.png"
                    alt="预览图不存在"
                    style="width: 50px; height: 50px"
                  />
                </div>
              </template>
            </el-image>
            <div v-else style="width: 50px; height: 50px"></div>
          </template>
        </el-table-column>
        <el-table-column label="二维码地址" prop="qrcode" min-width="360">
          <template #default="scope">
            <el-link :underline="false" type="primary" :href="scope.row.qrcode" target="_blank">{{
              scope.row.qrcode
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="更新人" prop="updateUser" min-width="120" />
        <el-table-column label="更新时间" prop="updateTime" min-width="220" />
        <el-table-column label="创建人" prop="createUser" min-width="120" />
        <el-table-column label="创建时间" prop="createTime" min-width="220" />
        <el-table-column fixed="right" label="操作" width="80px">
          <template #default="scope">
            <el-link :underline="false" type="primary" @click="onEdit(scope.row)">编辑 </el-link>
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog
      :visible="state.createDialogVisible"
      @close="onClose"
      @success="handleRefreshList"
    />
    <WhiteListDialog
      :visible="state.whiteListDialogVisible"
      @close="onClose"
      @success="handleRefreshList"
    />
    <UpdateDialog
      :data="state.detail"
      :visible="state.updateDialogVisible"
      @close="state.updateDialogVisible = false"
      @success="handleRefreshList"
    />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, UnwrapNestedRefs, ref, ComponentPublicInstance } from 'vue';
  import CreateDialog from './Create.vue';
  import UpdateDialog from './Update.vue';
  import WhiteListDialog from './WhiteList.vue';
  import { requestV2 } from '@/axios/request';
  import List from '../../components/ListNew.vue';
  import { AdvertisingPlan } from '@/types/apis/advertising-plan';
  import { defaultTime } from './other';

  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const state = reactive({
    tableData: [] as AdvertisingPlan.Instance[],
    createDialogVisible: false,
    updateDialogVisible: false,
    whiteListDialogVisible: false,
    detail: undefined as AdvertisingPlan.Detail | undefined,
  });
  const query: UnwrapNestedRefs<AdvertisingPlan.ListQueryAxios> = reactive({
    params: {
      title: '',
      timeRange: [],
    },
  });

  const resetQuery = () => {
    query.params = {
      title: '',
      timeRange: [],
    };
  };

  const requestFn = requestV2.adList;

  const handleRefreshList = () => {
    if (listRef.value) {
      listRef.value.getList();
    }
  };
  const onEdit = (data: AdvertisingPlan.Instance) => {
    requestV2.adDetail({ replacements: { id: data.id } }).then((res) => {
      state.detail = res.data;
      state.updateDialogVisible = true;
    });
  };

  const onClose = () => {
    state.createDialogVisible = false;
    state.updateDialogVisible = false;
    state.whiteListDialogVisible = false;
  };
</script>
