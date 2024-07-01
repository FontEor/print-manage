<template>
  <div class="version-management">
    <el-table
      v-loading="loading"
      :height="tableHeight"
      :data="state.tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="tempVersion" label="版本号" width="120" />
      <el-table-column prop="defaultVersion" label="默认版本" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.defaultVersion" class="ml-2" type="success">默认</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="发布状态" width="120">
        <template #default="scope">
          <span v-if="scope.row.status === 0">编辑中</span>
          <span v-if="scope.row.status === 1">已发布</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="模板URL" width="120">
        <template #default="scope">
          {{ `${state.urlPrefix}${scope.row.pluginPath}` }}
        </template>
      </el-table-column>
      <el-table-column prop="sourceName" label="数据源" />
      <el-table-column label="预览图">
        <template #default="scope">
          <el-image
            style="max-width: 320px; max-height: 500px"
            :src="`${state.urlPrefix}${scope.row.coverImage}`"
            :preview-src-list="[state.urlPrefix + scope.row.coverImage]"
            :initial-index="1"
            fit="cover"
            preview-teleported
          >
            <template #error>
              <div></div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="updateUser" label="更新人账号" />
      <el-table-column prop="updateTime" label="更新人时间" />
      <el-table-column label="操作" min-width="200px">
        <template #default="scope">
          <el-button @click="drawTemplate(scope.row)" link type="primary">
            {{ scope.row.status === 1 ? '创建副本' : '绘制' }}
          </el-button>
          <!-- 已经发布 并且不是默认版本的 -->
          <el-button
            v-if="scope.row.status === 1 && !scope.row.defaultVersion"
            link
            type="primary"
            @click="onSetDefault(scope.row)"
            >设置为默认</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            link
            type="primary"
            @click="handlePublish(scope.row.id)"
            >发布</el-button
          >
          <el-button link type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      ref="pagination"
      background
      layout="prev, pager, next, sizes, jumper, total"
      :current-page="state.currentPage"
      :total="state.total"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="state.page.size"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <!-- 删除弹窗 -->
    <el-dialog v-model="deleteDialogVisible" center title="删除提示" width="400px">
      <div class="dialog-content" v-if="!state.showDelete">
        <p>当前版本为默认版本，</p>
        <p>直接删除会影响用户使用。</p>
      </div>
      <div class="dialog-content" v-else>
        <p>该版本的基础信息及模板样式</p>
        <p>都将被删除，您确认删除吗？</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <span v-if="!state.showDelete">
            <el-button type="primary" @click="deleteDialogVisible = false">关闭</el-button>
          </span>
          <span v-else>
            <el-button type="primary" @click="confirmDelete">删除</el-button>
            <el-button @click="deleteDialogVisible = false">不删除</el-button>
          </span>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { requestV1 } from '@/axios/request';
  import { ElMessage } from 'element-plus';
  import { Version } from '../../../../types/apis/version';
  import broadcast from '../../../../utils/broadcast';
  import type { Broadcast } from '../../../../utils/broadcast';
  import throttle from 'lodash/throttle';
  import { Session } from '../../../../utils/session';

  const loading = ref(false);
  // 自动计算表格高度
  const tableHeight = ref(0);
  const computedTableHeight = () => {
    const containerHeight = document.documentElement.clientHeight;
    tableHeight.value = containerHeight - 350;
  };

  const deleteDialogVisible = ref(false);
  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    tableData: [] as any[],
    showDelete: false,
    id: 0,
    temId: 0,
    verId: 0,
    page: {
      from: 1,
      size: 20,
    },
    currentPage: 1,
    total: 0,
    imgUrl: '',
  });

  const emits = defineEmits(['getTemplateDetail']);

  onMounted(async () => {
    const route = useRoute();
    state.id = Number(route.query.id);
    state.temId = Number(route.query.temId);
    await getVersionList();
    computedTableHeight();
    window.onresize = throttle(() => {
      computedTableHeight();
    }, 300);
    broadcast.addListener('refreshList', channelMessageHandler);
  });

  onUnmounted(() => {
    broadcast.removeListener('refreshList', channelMessageHandler);
  });

  const getVersionList = async () => {
    loading.value = true;
    const { id, temId } = state;
    const params = { from: state.page.from, size: state.page.size, tempType: 1 };
    const response = await requestV1.versionList({
      params,
      replacements: { id, temId },
    });
    state.tableData = response.data;
    state.total = response.total;
    loading.value = false;
  };

  // 发布
  const handlePublish = (verId: number) => {
    const { temId, id } = state;
    const params = { force: 1, tempType: 1 };
    requestV1
      .versionPublish({
        params: {
          force: 1,
          tempType: 1,
        },
        replacements: {
          id,
          verId,
          temId,
        },
      })
      .then(() => {
        ElMessage.success('发布成功');
        getVersionList();
      });
  };

  // 删除前校验
  const handleDelete = async (verId: number) => {
    const { temId, id } = state;
    const params = { checkFlag: 1 };
    const response = await requestV1
      .versionDelete({ params, replacements: { id, verId, temId } })
      .catch(() => {
        throw new Error('删除接口异常');
      });
    const { data } = response;
    data ? (state.showDelete = false) : (state.showDelete = true);
    state.verId = verId;
    deleteDialogVisible.value = true;
  };

  // 确认删除
  const confirmDelete = async () => {
    const { temId, verId, id } = state;
    const params = { checkFlag: 0 };
    const response = await requestV1
      .versionDelete({ params, replacements: { id, verId, temId } })
      .catch(() => {
        throw new Error('删除接口异常');
      });
    deleteDialogVisible.value = false;
    ElMessage.success('删除成功');
    getVersionList();
  };

  const onSizeChange = (size: number) => {
    state.page.size = size;
    state.page.from = 1;
    state.currentPage = 1;
    getVersionList();
  };

  const onCurrentChange = (index: number) => {
    state.currentPage = index;
    state.page.from = index;
    getVersionList();
  };

  const drawTemplate = (row: Version.Instance) => {
    window.open(
      `/editor/?tempType=1&orgId=${state.id}&temId=${row.tempId}&sourceId=${
        row.sourceId || ''
      }&verId=${row.id || ''}&templateCode=${row.code}`,
      '_blank',
    );
  };

  const onSetDefault = (data: Version.Instance) => {
    requestV1
      .versionSetDefault({
        replacements: {
          id: Session.getOrgId(),
          temId: data.tempId,
          verId: data.id,
        },
        params: {
          tempType: data.type,
        },
      })
      .then((response) => {
        ElMessage.success('设置成功');
        getVersionList();
        emits('getTemplateDetail');
      });
  };

  // 信道监听回调处理函数
  const channelMessageHandler = (data: Broadcast.Data) => {
    if (data.type === 'refreshList') {
      getVersionList();
    }
  };
</script>

<style lang="less" scoped>
  .version-management {
    .img-link {
      cursor: pointer;
      color: #3c6ef0;
    }
    :deep(.el-pagination) {
      position: relative;
      text-align: right;
      margin-top: 1.5rem;
      display: flex;
      align-content: flex-start;
      justify-content: flex-end;
      flex-wrap: nowrap;
      flex-direction: row;
      align-items: center;
      .el-pagination__total {
        position: absolute;
        left: 0;
        top: 3px;
      }
    }
    .dialog-content {
      line-height: 30px;
    }
  }
</style>
