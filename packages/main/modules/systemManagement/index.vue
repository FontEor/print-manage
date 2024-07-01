<template>
  <div class="system-management">
    <List :request-fn="requestV1.systemList" :query="query" ref="listRef">
      <template #search>
        <el-form-item>
          <el-input v-model="query.params.codeOrName" placeholder="输入系统名称或编码" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.params.owner" placeholder="输入系统负责人账号" />
        </el-form-item>
      </template>
      <template #active>
        <el-button v-permission:系统创建 @click="handleAccess" type="primary">
          <el-icon><Plus /></el-icon>&ensp;接入系统
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="name" label="系统名称" />
        <el-table-column prop="code" label="系统编码" />
        <el-table-column prop="owner" label="负责人账号" />
        <el-table-column prop="ownerDep" label="系统归属" />
        <el-table-column prop="updateUser" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button link type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
    <!-- 接入系统弹窗 -->
    <AccessSystemDialog v-model:dialogFormVisible="dialogFormVisible" @closed="handleClosed" />

    <!-- 删除弹窗 -->
    <el-dialog v-model="deleteDialogVisible" center title="删除提示" width="400px">
      <div class="dialog-content" v-if="!state.showDelete">
        <p>本数据源绑定了已发布模板，</p>
        <p>请将模板数据源更换后再进行删除。</p>
      </div>
      <div class="dialog-content" v-else>
        <p>系统的基本信息及所有数据源都将被删除，</p>
        <p>您确认要删除系统吗？</p>
      </div>
      <template #footer>
        <span v-if="!state.showDelete" class="dialog-footer">
          <el-button type="primary" @click="deleteDialogVisible = false">关闭</el-button>
        </span>
        <span v-else class="dialog-footer">
          <el-button type="primary" @click="confirmDelete">删除</el-button>
          <el-button @click="deleteDialogVisible = false">不删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { requestV1 } from '@/axios/request';
  import List from '../../components/List.vue';
  import AccessSystemDialog from './accessSystemDialog.vue';
  import type { SystemData } from '../../types/apis/systemData';
  import { router } from '../../router';
  import { ElMessage } from 'element-plus';

  const dialogFormVisible = ref(false);
  const deleteDialogVisible = ref(false);
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // 查询条件数据
  const query: SystemData.ListQueryAxios = reactive({
    params: {
      codeOrName: '',
      owner: '',
    },
    replacements: {
      id: 0,
    },
  });

  const state = reactive({
    showDelete: false,
    deleteId: 0,
  });

  const handleAccess = () => {
    dialogFormVisible.value = true;
  };

  const handleClosed = (refresh: boolean) => {
    dialogFormVisible.value = false;
    if (refresh) {
      listRef.value?.getList();
    }
  };

  // 编辑
  const handleEdit = (id: number) => {
    router.push({ name: 'SystemManagementDetail', query: { id } });
  };

  // 删除前校验
  const handleDelete = async (id: number) => {
    const params = { checkFlag: 1 };
    const replacements = { id };
    const response = await requestV1
      .systemDelete({
        params,
        replacements,
      })
      .catch(() => {
        throw new Error('删除接口异常');
      });
    const { hasSource, hasPublishTemp } = response.data;
    // 有数据源且已绑定发布模板，则不允许删除
    if (hasSource === 1 && hasPublishTemp === 1) {
      state.showDelete = false;
    } else {
      state.showDelete = true;
    }
    state.deleteId = id;
    deleteDialogVisible.value = true;
  };

  //确认删除
  const confirmDelete = async () => {
    const params = { checkFlag: 0 };
    const replacements = { id: state.deleteId };
    const response = await requestV1
      .systemDelete({
        params,
        replacements,
      })
      .catch(() => {
        throw new Error('删除接口异常');
      });
    deleteDialogVisible.value = false;
    ElMessage.success('删除成功');
    listRef.value?.getList();
  };
</script>

<style lang="less" scoped>
  .dialog-content {
    line-height: 40px;
    font-size: 16px;
  }
</style>
