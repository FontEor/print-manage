<template>
  <div class="account-list-container">
    <List :request-fn="requestV1.bluetoothList" :query="query" ref="listRef">
      <template #search>
        <el-form-item label="" label-width="0px">
          <el-input
            class="w300"
            v-model="query.params.tradeName"
            placeholder="输入设备厂商名称、设备型号"
          />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd" type="primary">
          <el-icon><Plus /></el-icon>&ensp;新增支持的蓝牙设备
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="tradeName" label="设备厂商名称" min-width="120px" />
        <el-table-column prop="model" label="设备型号" min-width="100px" />
        <el-table-column prop="regep" label="设备蓝牙名称" min-width="140px" />
        <el-table-column prop="printTypeDesc" label="支持的打印方式" min-width="140px" />
        <el-table-column prop="recomandPrintTypeDesc" label="推荐的打印方式" min-width="140px" />
        <el-table-column prop="updateUser" label="更新人" min-width="100px" />
        <el-table-column prop="updateTime" label="操作时间" width="180px" />
        <el-table-column prop="id" label="操作" width="170px">
          <template #default="scope">
            <el-button link type="primary" @click="onEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog
      :visible="state.showCreate"
      :data="state.instance"
      :action="state.dialogAction"
      @closed="onClosed"
    />
  </div>
</template>

<script setup lang="ts" name="SourceList">
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../components/List.vue';
  import CreateDialog from './Create.vue';

  import type { Bluetooth } from '../../types/apis/bluetooth';
  import { requestV1 } from '@/axios/request';

  // 查询条件数据
  const query: Bluetooth.ListAxios = reactive({
    params: {
      tradeName: '',
      model: '', // 后台要求同时传入这两个字段 但前端不做处理
    },
  });

  // data数据
  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    showCreate: false,
    dialogAction: 'create',
    instance: undefined as Bluetooth.Instance | undefined,
  });

  // 重置查询
  const onResetQuery = () => {
    query.params.tradeName = '';
    listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    if (refresh) {
      listRef.value?.getList();
    }
    state.showCreate = false;
  };

  const onAdd = () => {
    state.dialogAction = 'create';
    state.showCreate = true;
  };

  // 详情
  const getDetail = (data: Bluetooth.Instance) => {
    return new Promise((resolve, reject) => {
      requestV1
        .bluetoothDetail({
          replacements: {
            id: data.id,
          },
        })
        .then((response) => {
          state.instance = response.data;
          return resolve(response.data);
        })
        .catch(reject);
    });
  };
  // 编辑
  const onEdit = (data: Bluetooth.Instance) => {
    getDetail(data).then((data) => {
      state.dialogAction = 'edit';
      state.showCreate = true;
    });
  };
  // 详情
  const onDetail = (data: Bluetooth.Instance) => {
    getDetail(data).then((data) => {
      state.dialogAction = 'info';
      state.showCreate = true;
    });
  };
  // 删除
  const onDelete = (data: Bluetooth.Instance) => {
    ElMessageBox.confirm(`您确认要删除该蓝牙设备吗？`, '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      requestV1
        .bluetoothDelete({
          replacements: {
            id: data.id,
          },
        })
        .then(() => {
          ElMessage.success('删除成功');
          listRef.value?.getList();
        });
    });
  };

  defineExpose({
    resetQuery: onResetQuery,
  });
</script>
<script lang="ts">
  export default {
    name: 'Bluetooth',
  };
</script>
