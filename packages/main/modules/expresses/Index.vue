<template>
  <div class="account-list-container">
    <List :request-fn="requestV1.expressList" :query="query" ref="listRef">
      <template #search>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.params.nameOrCode" placeholder="输入数据源编码或名称" />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd" type="primary">
          <el-icon><Plus /></el-icon>&ensp;新建承运商
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="deliveryNum" label="承运商ID" min-width="120px" />
        <el-table-column prop="code" label="承运商编码" min-width="100px" />
        <el-table-column prop="name" label="承运商名称" min-width="100px" />
        <el-table-column prop="logoPath" label="Logo图地址" min-width="120px">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 40px"
              :src="state.urlPrefix + scope.row.logoPath"
              :preview-src-list="[state.urlPrefix + scope.row.logoPath]"
              :initial-index="1"
              fit="cover"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120px" />
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
    <CreateDialog
      :visible="state.showCreate"
      :data="state.instance"
      :action="state.dialogAction"
      @closed="onClosed"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../components/List.vue';
  import CreateDialog from './Create.vue';

  import type { SourceData } from '@/types/apis/sourceData';
  import { requestV1 } from '@/axios/request';
  import { Plus } from '@element-plus/icons-vue';
  import { Express } from '@/types/apis/express';

  // 查询条件数据
  const query: SourceData.ListQueryAxios = reactive({
    params: {
      isPage: 1,
      nameOrCode: '',
      id: undefined,
    },
    replacements: {
      // 这个需要替换
      id: '',
    },
  });

  // data数据
  const state = reactive({
    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    showCreate: false,
    dialogAction: 'create',
    instance: undefined as Express.Instance | undefined,
  });

  // 重置查询
  const onResetQuery = () => {
    query.params.id = undefined;
    query.params.nameOrCode = '';
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

  const getDetail = (data: Express.Instance) => {
    return new Promise((resolve, reject) => {
      requestV1
        .expressDetail({
          replacements: {
            deliveryId: data.id,
          },
        })
        .then((response) => {
          state.instance = response.data;
          return resolve(response.data);
        })
        .catch(reject);
    });
  };

  const onAdd = () => {
    state.dialogAction = 'create';
    state.showCreate = true;
  };

  const onEdit = (data: Express.Instance) => {
    getDetail(data).then(() => {
      state.dialogAction = 'edit';
      state.showCreate = true;
    });
  };

  // const onDetail = (data: Express.Instance) => {
  //   getDetail(data).then((data) => {
  //     state.dialogAction = 'info';
  //     state.showCreate = true;
  //   });
  // };

  const onDelete = (data: Express.Instance) => {
    ElMessageBox.confirm(`您确认要删除该承运商吗？`, '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      requestV1
        .expressDelete({
          replacements: {
            deliveryId: data.id,
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
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
  import { ComponentPublicInstance } from 'vue';
  export default {
    name: 'SourceList',
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
