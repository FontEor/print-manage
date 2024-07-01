<template>
  <div class="account-list-container">
    <List :request-fn="requestV1.sourceList" :query="query" :init="false" ref="listRef">
      <template #search>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.params.nameOrCode" placeholder="输入数据源编码或名称" />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd" type="primary">
          <el-icon><Plus /></el-icon>&ensp;新建数据源
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="code" label="数据源编码" min-width="100px" />
        <el-table-column prop="name" label="数据源名称" min-width="100px" />
        <el-table-column prop="orgCode" label="所属系统编码" min-width="120px" />
        <el-table-column prop="updateUser" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" width="180px" />
        <el-table-column prop="id" label="操作" width="170px">
          <template #default="scope">
            <el-button link type="primary" @click="onDetail(scope.row, 'summary')"
              >编辑详情</el-button
            >
            <el-button link type="primary" @click="onDetail(scope.row, 'data')">数据模型</el-button>
            <el-button link type="primary" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog :visible="state.showCreate" @closed="onClosed" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../components/List.vue';
  import CreateDialog from './Create.vue';

  import type { SourceData } from '@/types/apis/sourceData';
  import type { System } from '@/types/apis/system';
  import { requestV1 } from '@/axios/request';
  import { router } from '@/router';
  import { Session } from '@/utils/session';
  import { Plus } from '@element-plus/icons-vue';

  const getSystem = (needGetList = true) => {
    requestV1
      .systemNoPageList({
        params: {
          isPage: 0,
        },
      })
      .then((response) => {
        state.systems = response.data;
        needGetList && listRef.value?.getList();
      });
  };

  // 查询条件数据
  const query: SourceData.ListQueryAxios = reactive({
    params: {
      isPage: 1,
      nameOrCode: '',
      id: Session.getOrgId(),
    },
    replacements: {
      // 这个需要替换
      id: '',
    },
  });

  // data数据
  const state = reactive({
    showCreate: false,
    systems: [] as System.Instance[],
  });

  // 重置查询
  const onResetQuery = () => {
    query.params.nameOrCode = '';
    listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // 加载
  onMounted(() => {
    getSystem();
  });

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    if (refresh) {
      listRef.value?.getList();
    }
    state.showCreate = false;
  };

  const onAdd = () => {
    state.showCreate = true;
  };

  // 查看详情
  const onDetail = (data: SourceData.Instance, tag: string) => {
    router.push({
      name: 'SourcesDetail',
      query: {
        id: data.id,
        sourceId: data.orgId,
        tag,
      },
    });
  };

  const onDelete = (data: SourceData.Instance) => {
    ElMessageBox.confirm(
      `数据源基本信息及数据模型都将被删除，您确认要删除该数据源吗？`,
      '删除提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      },
    ).then(() => {
      requestV1
        .sourceDelete({
          replacements: {
            id: data.orgId,
            sourceId: `${data.id}`,
          },
        })
        .then(() => {
          ElMessage.success('删除成功');
          listRef.value?.getList();
        });
    });
  };

  defineExpose({
    getSystem,
    resetQuery: onResetQuery,
  });
</script>
<script lang="ts">
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
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
