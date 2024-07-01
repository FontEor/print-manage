<template>
  <div class="template-list-wrap system-administration">
    <List
      ref="listRef"
      :request-fn="requestV2.systemList"
      :query="query"
      @reset-query="onResetQuery"
    >
      <template #form>
        <el-form-item class="width-adjustment width-fixed" label="名称/编码" label-width="100px">
          <el-input v-model="query.params.codeOrName" placeholder="输入系统名称或编码" />
        </el-form-item>
        <el-form-item class="width-adjustment width-fixed" label="系统负责人" label-width="100px">
          <el-input v-model="query.params.owner" placeholder="输入系统负责人账号" />
        </el-form-item>
      </template>
      <template #action>
        <p class="template-list-btn">
          <el-button v-permission:系统创建 @click="handelCreate" type="primary">
            创建系统
          </el-button>
        </p>
      </template>
      <template #column>
        <el-table-column prop="name" label="系统名称" />
        <el-table-column prop="code" label="系统编码" />
        <el-table-column prop="owner" label="负责人账号" />
        <el-table-column prop="ownerDep" label="系统归属" />
        <el-table-column prop="updateUser" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
  </div>
  <Create
    v-if="state.showCreate"
    :visible="state.showCreate"
    :row="state.row"
    @close="closeCreate"
  />
</template>
<script lang="ts" setup>
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { requestV2 } from '@/axios/request';
  import List from '@/components/ListNew.vue';
  import Create from './Create.vue';
  import type { SystemData } from '@/types/apis/systemData';

  const state = reactive({
    showCreate: false,
    row: {} as SystemData.Instance | undefined,
  });
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

  // 重置查询
  const onResetQuery = () => {
    query.params.codeOrName = '';
    query.params.owner = '';
    listRef.value?.getList();
  };

  const handelCreate = () => {
    state.showCreate = true;
  };

  // 编辑
  const handleEdit = (row: SystemData.Instance) => {
    state.row = row;
    state.showCreate = true;
  };
  const closeCreate = (refresh: boolean) => {
    state.showCreate = false;
    state.row = undefined;
    if (refresh) onResetQuery();
  };
</script>

<style lang="less" scoped>
  .dialog-content {
    line-height: 40px;
    font-size: 16px;
  }
</style>
