<template>
  <div class="plugin-list-container">
    <List
      :request-fn="requestV1.pluginInstallList"
      :query="query"
      query-position="data"
      ref="listRef"
      :offsetHeight="8"
    >
      <template #search>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.pluginVersionCode" placeholder="插件版本号" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-select clearable v-model="query.data.status" class="m-2" placeholder="运行状态">
            <el-option
              v-for="item in runStates"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-date-picker
            v-model="query.data.installTimes"
            type="datetimerange"
            range-separator="至"
            start-placeholder="初次安装起始时间"
            end-placeholder="初次安装截止时间"
            placeholder="安装时间"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-date-picker
            v-model="query.data.updateTimes"
            type="datetimerange"
            range-separator="至"
            start-placeholder="插件更新起始时间"
            end-placeholder="插件更新截止时间"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.machineId" placeholder="机器ID" />
        </el-form-item>
      </template>

      <template #table>
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="machineId" label="装机ID" min-width="120px" />
        <el-table-column prop="printLocation" label="打印地点" min-width="100px" />
        <el-table-column prop="pluginVersionCode" label="插件版本号" min-width="100px" />
        <el-table-column prop="machineName" label="机器名称" min-width="100px" />
        <el-table-column prop="cpuName" label="CPU型号" min-width="100px" />
        <el-table-column prop="macAddress" label="MAC地址" min-width="100px" />
        <el-table-column prop="status" label="插件运行状态" min-width="100px">
          <template #default="scope">
            <span>{{ formatRunState(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastHeartbeatTime" label="上一次心跳时间" min-width="100px" />
        <el-table-column prop="firstInstallTime" label="插件初次安装时间" min-width="100px" />
        <el-table-column prop="pluginUpgradeTime" label="插件更新时间" min-width="100px" />
      </template>
    </List>
  </div>
</template>

<script setup lang="ts" name="SourceList">
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../../components/List.vue';

  import type { PluginInstall } from '../../../types/apis/plugin';
  import { requestV1 } from '@/axios/request';
  import { runStates } from '../../../enums/runState';
  import selectList from '../../../mixins/selectList';

  import { datetimes } from '../../../mixins/defaultVar';

  // 查询条件数据
  const query: PluginInstall.ListQueryAxios = reactive({
    data: {
      installTimes: [],
      updateTimes: [],
      pluginVersionCode: '', //	插件版本号
      status: undefined, //	运行状态
      machineId: undefined, // 装机ID
    },
  });

  // data数据
  const state = reactive({});

  const { formatRunState } = selectList(state);

  // 重置查询
  const onResetQuery = () => {
    query.data.installTimes = [];
    query.data.updateTimes = [];
    query.data.pluginVersionCode = '';
    query.data.status = undefined;
    listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  defineExpose({
    resetQuery: onResetQuery,
  });
</script>
<script lang="ts">
  export default {
    name: 'PluginInstall',
  };
</script>
