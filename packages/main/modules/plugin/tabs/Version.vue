<template>
  <div class="plugin-list-container">
    <List
      :request-fn="requestV1.pluginVersionList"
      :hasSearchBtn="false"
      :query="{ params: {} }"
      ref="listRef"
      :offsetHeight="68"
    >
      <template #search>
        <el-form-item>
          <el-alert
            :title="`当前默认版本：${state.currentVersionCode}`"
            type="warning"
            :closable="false"
          />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd" type="primary">
          <el-icon><Plus /></el-icon>&ensp;新增插件版本
        </el-button>
      </template>
      <template #table>
        <el-table-column type="index" width="80px" label="序号" />
        <el-table-column prop="code" label="插件版本" min-width="120px" />
        <el-table-column prop="describe" label="版本说明" min-width="120px" />
        <el-table-column prop="remark" label="备注" min-width="100px" />
        <el-table-column prop="status" label="状态" min-width="100px">
          <template #default="scope">
            {{ formatUpDownState(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="downloadLink" label="下载地址" min-width="100px" />
        <el-table-column prop="createTime" label="创建时间" min-width="100px" />
        <el-table-column prop="lastShelfTime" label="最近一次上架时间" min-width="180px" />
        <el-table-column prop="id" label="操作" min-width="280px">
          <template #default="scope">
            <el-popover placement="top" width="160" popper-class="confirm-popover">
              <p>
                推送后,该版本会成为默认版本,用户重新打开京东云打印组件时,组件会引导用户更新至该版本。
              </p>
              <div>
                <el-button type="primary" size="small" @click="onPush(scope.row)"
                  >确认推送</el-button
                >
              </div>
              <template #reference>
                <el-button link type="primary">推送</el-button>
              </template>
            </el-popover>
            <el-popover placement="top" width="160" popper-class="confirm-popover">
              <p>
                下架后,安装该版本组件的用户重新打开京东云打印组件时,组件会强制用户更新至默认版本。
              </p>
              <div>
                <el-button type="primary" size="small" @click="onDown(scope.row)"
                  >确认下架</el-button
                >
              </div>
              <template #reference>
                <el-button link type="primary">下架</el-button>
              </template>
            </el-popover>
            <el-popover placement="top" width="160" popper-class="confirm-popover">
              <p> 上架后,该版本成为可用版本,可将该版本推送给用户使用。 </p>
              <div>
                <el-button type="primary" size="small" @click="onUp(scope.row)">确认上架</el-button>
              </div>
              <template #reference>
                <el-button link type="primary">上架</el-button>
              </template>
            </el-popover>
            <el-button link @click="onEdit(scope.row)" type="primary">编辑</el-button>
            <el-popover placement="top" width="160" popper-class="confirm-popover">
              <p> 删除后此版本记录将无法查看 </p>
              <div>
                <el-button type="primary" size="small" @click="onDelete(scope.row)"
                  >确认删除</el-button
                >
              </div>
              <template #reference>
                <el-button link type="primary">删除</el-button>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </template>
    </List>
    <VersionCreate
      :visible="state.showCreate"
      :action="state.action"
      :data="state.currentEditor"
      @closed="onClosed"
    />
  </div>
</template>

<script setup lang="ts" name="SourceList">
  import { ref, reactive, ComponentPublicInstance, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';

  import List from '../../../components/List.vue';
  import VersionCreate from './VersionCreate.vue';

  import type { PluginVersion } from '../../../types/apis/plugin';
  import { requestV1 } from '@/axios/request';
  import selectList from '../../../mixins/selectList';

  // data数据
  const state = reactive({
    action: 'create',
    showCreate: false,
    currentVersionCode: '',
    currentEditor: undefined as PluginVersion.Instance | undefined,
  });

  const { formatUpDownState } = selectList(state);

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  onMounted(() => {
    getCurrentVersion();
  });

  const getCurrentVersion = () => {
    requestV1.pluginVersionCurrentGet({}).then((response) => {
      state.currentVersionCode = response.data.code;
    });
  };

  const onAdd = () => {
    state.action = 'create';
    state.showCreate = true;
  };

  const onPush = (data: PluginVersion.Instance) => {
    requestV1
      .pluginVersionPush({
        replacements: {
          id: data.id,
        },
      })
      .then((response) => {
        ElMessage.success('推送成功');
        getCurrentVersion();
        onClosed({ refresh: true });
      })
      .catch(() => {
        ElMessage.error('推送失败');
      });
  };

  const onUp = (data: PluginVersion.Instance) => {
    requestV1
      .pluginVersionUpDown({
        data: {
          id: data.id,
          shelf: true,
        },
      })
      .then((response) => {
        ElMessage.success('上架成功');
        onClosed({ refresh: true });
      })
      .catch(() => {
        ElMessage.error('上架失败');
      });
  };

  const onDown = (data: PluginVersion.Instance) => {
    requestV1
      .pluginVersionUpDown({
        data: {
          id: data.id,
          shelf: false,
        },
      })
      .then((response) => {
        ElMessage.success('下架成功');
        onClosed({ refresh: true });
      })
      .catch(() => {
        ElMessage.error('下架失败');
      });
  };

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    if (refresh) {
      listRef.value?.getList();
    }
    state.showCreate = false;
  };

  const onEdit = (data: PluginVersion.Instance) => {
    requestV1
      .pluginVersionDetail({
        replacements: {
          id: data.id,
        },
      })
      .then((response) => {
        state.action = 'edit';
        state.currentEditor = response.data;
        state.showCreate = true;
      });
  };

  const onDelete = (data: PluginVersion.Instance) => {
    requestV1
      .pluginVersionDelete({
        replacements: {
          id: data.id,
        },
      })
      .then(() => {
        ElMessage.success('删除成功');
        onClosed({ refresh: true });
      });
  };
</script>
<script lang="ts">
  export default {
    name: 'PluginInstall',
  };
</script>
