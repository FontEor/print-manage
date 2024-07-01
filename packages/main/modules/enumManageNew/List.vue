<template>
  <div class="general-page-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" class="general-breadcrumb mb-12">
      <el-breadcrumb-item to="SourcesNew">数据源</el-breadcrumb-item>
      <el-breadcrumb-item @click="goBackToSourcesDetailNew">数据模型</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>枚举管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="enum-new-list-container p-24">
      <ListTab :request-fn="requestFn" :query="query" ref="listRef">
        <template #tool-right>
          <el-input
            class="w-240"
            v-model="query.params.nameOrCode"
            placeholder="请输入枚举项编码或名称"
            :suffix-icon="Search"
            clearable
            @blur="onSearch"
            @keyup.enter="onSearch"
            @clear="onSearch"
          />
        </template>
        <template #tool-left>
          <el-button @click="onImport" type="primary">导入枚举</el-button>
          <el-button @click="state.exampleDialog = true"> 导入示例 </el-button>
        </template>
        <template #column>
          <el-table-column prop="id" label="ID" min-width="100px" />
          <el-table-column prop="enumCode" label="编码" min-width="100px" />
          <el-table-column prop="enumName" label="名称" min-width="100px" />
          <el-table-column prop="updateUser" label="更新人" />
          <el-table-column prop="updateTime" label="更新时间" width="180px" />
          <el-table-column prop="id" label="操作" width="110px">
            <template #default="scope">
              <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
              <el-link type="primary" @click="onDelete(scope.row)" class="ml-16">删除</el-link>
            </template>
          </el-table-column>
        </template>
      </ListTab>
      <EditDialog
        v-model:visible="state.editDialog"
        @update:visible="state.editDialog = $event"
        :data="state.instance"
        @closed="onClosed"
      />
      <JsonDialog
        v-model:visible="state.importDialog"
        @update:visible="state.importDialog = $event"
        :confirm-fn="importConfirm"
      />
      <ExampleDialog
        v-model:visible="state.exampleDialog"
        @update:visible="state.exampleDialog = $event"
        @closed="state.exampleDialog = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import ListTab from '../../components/ListTab.vue';
  import EditDialog from './EditDialog.vue';
  import JsonDialog from '../../components/json/JsonDialog.vue';
  import ExampleDialog from './ExampleDialog.vue';

  import { Session } from '@/utils/session';
  import { requestV2 } from '@/axios/request';
  import { EnumsManage } from '@/types/apis/enumManage';
  import { Search } from '@element-plus/icons-vue';
  import { useGo } from '@/hooks/web/usePage';
  import { useRoute } from 'vue-router';

  const go = useGo();
  const route = useRoute();
  const requestFn = requestV2.enumList;
  // 查询条件数据
  const query: EnumsManage.ListAxios = reactive({
    params: {
      isPage: 1,
      nameOrCode: '',
      orgId: Session.getOrgId(),
    },
  });

  // data数据
  const state = reactive({
    importDialog: false,
    editDialog: false,
    exampleDialog: false,
    instance: undefined as undefined | EnumsManage.Instance,
  });

  // 重置查询
  // const onResetQuery = () => {
  //   query.params.nameOrCode = '';
  //   listRef.value?.getList();
  // };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof ListTab>>();

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    if (refresh) {
      listRef.value?.getList();
    }
    state.importDialog = false;
    state.editDialog = false;
  };

  const onImport = () => {
    state.instance = undefined;
    state.importDialog = true;
  };

  const onEdit = (data: EnumsManage.Instance) => {
    // state.instance = data;
    // state.importDialog = true;
    requestV2
      .enumDetail({
        replacements: {
          orgId: data.orgId,
          enumId: data.id,
        },
      })
      .then((response) => {
        state.instance = response.data;
        state.editDialog = true;
      });
  };

  const onDelete = (data: EnumsManage.Instance) => {
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '是否确认删除'),
        h(
          'div',
          { class: 'el-message-box-confirm_content' },
          '删除枚举项后，原绑定此枚举的数据字段返回的打印数据都不再根据枚举赋值，确认删除吗？',
        ),
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
          .enumDelete({
            replacements: {
              orgId: data.orgId,
              enumId: data.id,
            },
          })
          .then(() => {
            ElMessage.success('删除成功');
            listRef.value?.getList();
          });
      })
      .catch(() => {});
  };

  const importConfirm = (json: string) => {
    requestV2
      .enumImport({
        replacements: {
          orgId: Session.getOrgId(),
        },
        data: JSON.parse(json),
      })
      .then(() => {
        ElMessage.success('导入成功');
        onClosed({ refresh: true });
      });
  };

  const onSearch = () => {
    listRef.value?.getList();
  };
  const goBackToSourcesDetailNew = () => {
    const path = {
      path: '/sourcesDetailNew',
      query: route.query,
    };
    go(path);
  };
</script>
