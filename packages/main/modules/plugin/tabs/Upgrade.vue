<template>
  <div class="plugin-list-container">
    <List
      :request-fn="requestV1.pluginForceList"
      :query="query"
      ref="listRef"
      :offsetHeight="118"
      :sizes="[20, 50, 100, 200, 1000, 3000, 5000]"
    >
      <template #search>
        <el-form-item>
          <el-select clearable v-model="query.params.status" class="m-2" placeholder="升级状态">
            <el-option
              v-for="item in upgradeStates"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.params.pin" placeholder="京东PIN" />
        </el-form-item>
      </template>
      <template #tools>
        <div class="list-tools-container">
          <el-button @click="onSetFail()" type="primary">
            <el-icon><Plus /></el-icon>&ensp;批量设置打印失败率
          </el-button>
          <el-button @click="onForce()" type="primary">
            <el-icon><Plus /></el-icon>&ensp;批量强制升级
          </el-button>
          <el-button @click="onCancel()" type="primary">
            <el-icon><Plus /></el-icon>&ensp;批量暂停升级
          </el-button>
          <el-button @click="onRestore()" type="primary">
            <el-icon><Plus /></el-icon>&ensp;批量恢复升级
          </el-button>
          <el-button @click="onImport" type="primary">
            <el-icon><Plus /></el-icon>&ensp;批量导入商家
          </el-button>
        </div>
      </template>
      <template #table>
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="pin" label="商家PIN" min-width="120px" />
        <el-table-column prop="status" label="升级状态" min-width="100px">
          <template #default="scope">
            <span>{{ formatUpgradeState(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pluginVersion" label="插件版本号" min-width="100px" />
        <el-table-column prop="completedTime" label="升级完成时间" min-width="100px" />
        <el-table-column prop="percentage" label="打印失败概率" min-width="100px" />
        <el-table-column prop="id" label="操作" width="170px">
          <template #default="scope">
            <el-button link type="primary" @click="onSetFail(scope.row)"
              >设置打印失败概率</el-button
            >
            <el-button link type="primary" @click="onForce(scope.row)">强制升级</el-button>
            <el-button link type="primary" @click="onCancel(scope.row)">暂停升级</el-button>
            <el-button link type="primary" @click="onRestore(scope.row)">恢复升级</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
    <UpgradeFailDialog :visible="state.showFail" :data="state.instance" @closed="onClosed" />
    <UpgradeImportDialog :visible="state.showImport" @closed="onClosed" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../../components/List.vue';

  import { requestV1 } from '@/axios/request';
  import { PluginForceUpdate } from '@/types/apis/plugin';
  import { upgradeStates } from '@/enums/upgrade';

  import UpgradeFailDialog from './UpgradeFail.vue';
  import UpgradeImportDialog from './UpgradeImport.vue';
  import selectList from '../../../mixins/selectList';
  import { Plus } from '@element-plus/icons-vue';

  // 查询条件数据
  const query: PluginForceUpdate.ListQueryAxios = reactive({
    params: {
      pin: '',
      status: undefined,
    },
  });

  // data数据
  const state = reactive({
    showFail: false,
    showImport: false,

    urlPrefix: import.meta.env.VITE_APP_DOWNLOAD_PRE,
    showCreate: false,
    dialogAction: 'create',
    instance: undefined as PluginForceUpdate.Instance[] | undefined,
  });

  const { formatUpgradeState } = selectList(state);

  // 重置查询
  const onResetQuery = () => {
    query.params.status = undefined;
    query.params.pin = '';
    listRef.value?.getList();
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List & { getList: Function }>>();

  const onSetFail = (data?: PluginForceUpdate.Instance) => {
    state.instance = data ? [data] : getSelectRows();
    state.showFail = true;
  };

  const onImport = () => {
    state.showImport = true;
  };

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    if (refresh) {
      listRef.value?.getList();
    }
    state.showFail = false;
    state.showCreate = false;
    state.showImport = false;
  };

  const onForce = (data?: PluginForceUpdate.Instance) => {
    const pins = data ? data.pin : getSelectRowsPin();
    ElMessageBox.confirm(`您确认要强制升级吗？`, '升级提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      requestV1
        .pluginStartUpgrade({
          data: {
            pins: pins,
          },
        })
        .then(() => {
          ElMessage.success('强制升级指令已发送');
          listRef.value?.getList();
        });
    });
  };

  const onCancel = (data?: PluginForceUpdate.Instance) => {
    const pins = data ? data.pin : getSelectRowsPin();
    ElMessageBox.confirm(`您确认要取消升级吗？`, '取消提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      requestV1
        .pluginPauseUpgrade({
          data: {
            pins: pins,
          },
        })
        .then(() => {
          ElMessage.success('取消升级指令已发送');
          listRef.value?.getList();
        });
    });
  };

  const onRestore = (data?: PluginForceUpdate.Instance) => {
    const pins = data ? data.pin : getSelectRowsPin();
    ElMessageBox.confirm(`您确认要恢复升级吗？`, '恢复提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      requestV1
        .pluginResumeUpgrade({
          data: {
            pins: pins,
          },
        })
        .then(() => {
          ElMessage.success('恢复升级指令已发送');
          listRef.value?.getList();
        });
    });
  };

  const getSelectRowsPin = () => {
    const rows = listRef.value?.$refs.table.getSelectionRows();
    if (rows && rows.length) {
      return rows.map((row: PluginForceUpdate.Instance) => row.pin);
    } else {
      ElMessage.error('请选择数据');
      throw new Error('未选择数据');
    }
  };

  const getSelectRows = () => {
    const rows = listRef.value?.$refs.table.getSelectionRows();
    if (rows && rows.length) {
      return rows;
    } else {
      ElMessage.error('请选择数据');
      throw new Error('未选择数据');
    }
  };

  defineExpose({
    resetQuery: onResetQuery,
  });
</script>
<script lang="ts">
  import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

  export default {
    name: 'Upgrade',
    beforeRouteEnter(
      to: RouteLocationNormalized,
      form: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) {
      next((vm) => {
        if (vm.resetQuery) {
          vm.resetQuery();
        }
      });
    },
  };
</script>
