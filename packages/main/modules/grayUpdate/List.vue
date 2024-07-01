<template>
  <div class="template-list-wrap action-close-searh">
    <List
      ref="listRef"
      :request-fn="requestFn"
      :has-search="false"
      @reset-query="onResetQuery"
    >
      <template #action>
        <p class="template-list-btn">
          <el-button type="primary" @click="onAdd">配置策略</el-button>
        </p>
      </template>
      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="策略名称" prop="name" min-width="120px" />
        <el-table-column label="灰度组件版本" prop="version" min-width="80px" />
        <el-table-column label="投放范围" prop="upgradeType" min-width="180px">
          <template #default="scope">
            {{ strategyTypeEnum[scope.row.upgradeType] }}
          </template>
        </el-table-column>
        <el-table-column label="升级率" prop="upgradePercent" width="80px" />
        <el-table-column label="状态" prop="status" width="80px">
          <template #default="scope">
            {{ scope.row.status === 1 ? '已关闭' : '生效中' }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createUser" width="120px" />
        <el-table-column label="创建时间" prop="createTime" width="180px">
          <template #default="scope">
            {{ formatDataString(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="id" width="150px">
          <template #default="scope">
            <el-link
              class="source-new-link mr-16"
              type="primary"
              :underline="false"
              @click="onView(scope.row)"
              >详情
            </el-link>
            <el-link
              class="source-new-link"
              type="primary"
              :underline="false"
              @click="onClose(scope.row)"
              >关闭
            </el-link>
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog :visible="state.showCreate" @closed="onClosed" @confirm="onConfirm" />
    <ViewDialog :visible="state.showView" @closed="onClosed" :data="state.detail" />
  </div>
</template>
<script lang="ts" setup>
  import { ComponentPublicInstance, defineComponent, reactive, ref, h } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  import List from '@/components/ListNew.vue';
  import CreateDialog from './Create.vue';
  import ViewDialog from './View.vue';

  import { requestV2 } from '@/axios/request';
  import { strategyTypeEnum } from '@/enums/strategy';
  import { GrayUpgradeStrategy } from "@/types/apis/gray-upgrade-strategy";
  import { formatDataString } from "@/axios/utils";

  const requestFn = requestV2.grayUpgradeList;

  // data数据
  const state = reactive({
    showCreate: false,
    showView: false,
    detail: {} as GrayUpgradeStrategy.Instance,
  });

  // 重置查询
  const onResetQuery = () => {
    // listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const onRefreshList = () => {
    if (listRef.value) {
      listRef.value.getList();
    }
  };

  const onClosed = () => {
    state.showCreate = false;
    state.showView = false;
  };

  const onConfirm = () => {
    onRefreshList();
    onClosed();
  };

  const onAdd = () => {
    state.showCreate = true;
  };

  const onView = (data: GrayUpgradeStrategy.Instance) => {
    console.log('3454345');
    requestV2
      .grayUpgradeDetail({
        replacements: {
          id: data.id,
        },
      })
      .then((response) => {
        state.detail = response.data;
        state.showView = true;
      });
  };

  const onClose = (data: GrayUpgradeStrategy.Instance) => {
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '提示'),
        h('div', { class: 'el-message-box-confirm_content' }, '你确认要关闭该灰度升级策略吗?'),
      ]),
      '',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'el-message-box-confirm',
      },
    )
      .then(() => {
        requestV2
          .grayUpgradeClose({
            replacements: {
              id: data.id,
            },
          })
          .then(() => {
            ElMessage.success('关闭成功');
            listRef.value?.getList();
          });
      })
      .catch(() => {});
  };
  defineComponent({
    name: 'GrayUpdateComponent',
  });
</script>
