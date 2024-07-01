<template>
  <div class="account-list-container">
    <List :request-fn="requestV1.enumList" :query="query" ref="listRef">
      <template #search>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.params.nameOrCode" placeholder="输入枚举项编码或名称" />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onImport" type="primary"> 批量导入枚举项 </el-button>
        <el-button @click="state.exampleDialog = true" type="default"> 导入示例 </el-button>
      </template>
      <template #table>
        <el-table-column prop="id" label="枚举项ID" min-width="100px" />
        <el-table-column prop="enumCode" label="枚举项编码" min-width="100px" />
        <el-table-column prop="enumName" label="枚举项名称" min-width="100px" />
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
</template>

<script setup lang="ts" name="SourceList">
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../components/List.vue';
  import EditDialog from './EditDialog.vue';
  import JsonDialog from '../../components/json/JsonDialog.vue';
  import ExampleDialog from './ExampleDialog.vue';

  import { Session } from '../../utils/session';
  import { requestV1 } from '@/axios/request';
  import { EnumsManage } from '../../types/apis/enumManage';

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
  const onResetQuery = () => {
    query.params.nameOrCode = '';
    listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

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
    requestV1
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
      `删除枚举项后，原绑定此枚举的数据字段返回的打印数据都不再根据枚举赋值，确认删除吗？`,
      '删除提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      },
    ).then(() => {
      requestV1
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
    });
  };

  const importConfirm = (json: string) => {
    requestV1
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

  defineExpose({
    resetQuery: onResetQuery,
  });
</script>
<script lang="ts">
  export default {
    name: 'EnumManageList',
  };
</script>
