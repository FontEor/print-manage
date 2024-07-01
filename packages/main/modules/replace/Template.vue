<template>
  <div class="account-list-container">
    <List :request-fn="requestV1.templateReplaceList" :query="query" ref="listRef">
      <template #search>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.params.key" placeholder="输入模板编码或名称" />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd" type="primary">
          <el-icon><Plus /></el-icon>&ensp;新增配置
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="templateCode" label="模板ID" min-width="100px" />
        <el-table-column prop="templateName" label="模板名称" min-width="100px" />
        <el-table-column prop="oldUrl" label="老模板URL" min-width="120px" />
        <el-table-column prop="newUrl" label="新模板URL" min-width="120px" />
        <el-table-column prop="updateUser" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" width="180px" />
        <el-table-column prop="id" label="操作" width="170px">
          <template #default="scope">
            <el-button link type="primary" @click="onEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog :visible="state.showCreate" :detail="state.detail" @closed="onClosed" />
  </div>
</template>

<script setup lang="ts" name="SourceList">
  import {
    ref,
    reactive,
    computed,
    onMounted,
    onUnmounted,
    InjectionKey,
    ComponentPublicInstance,
  } from 'vue';
  import { useStore, Store, createNamespacedHelpers } from 'vuex';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../components/List.vue';
  import CopyButton from '../../components/buttons/CopyButton.vue';
  import CreateDialog from './Create.vue';

  import type { SourceData } from '../../types/apis/sourceData';
  import type { System } from '../../types/apis/system';
  import { requestV1 } from '@/axios/request';
  import storeMain from '../../store';

  // 查询条件数据
  const query: TemplateReplace.ListQueryAxios = reactive({
    params: {
      key: '',
    },
  });

  // data数据
  const state = reactive({
    showCreate: false,
    systems: [] as System.Instance[],
    detail: undefined as TemplateReplace.Instance | undefined,
  });

  // 重置查询
  const onResetQuery = () => {
    query.params.key = '';
    listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // 加载
  onMounted(() => {});

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    state.detail = undefined;
    if (refresh) {
      listRef.value?.getList();
    }
    state.showCreate = false;
  };

  const onAdd = () => {
    state.detail = undefined;
    state.showCreate = true;
  };

  const onEdit = (data: TemplateReplace.Instance) => {
    state.detail = data;
    state.showCreate = true;
  };

  const onDelete = (data: TemplateReplace.Instance) => {
    ElMessageBox.confirm(`这会立刻影响线上打印模板的样式，您确认要删除该模板映射吗？`, '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      requestV1
        .templateReplaceDelete({
          params: {
            id: data.id,
          },
        })
        .then(() => {
          ElMessage.success('删除成功');
          listRef.value?.getList();
        });
    });
  };
</script>
<script lang="ts">
  import { Session } from '../../utils/session';
  import { TemplateReplace } from '../../types/apis/template';
  export default {
    name: 'TemplateReplace',
  };
</script>
