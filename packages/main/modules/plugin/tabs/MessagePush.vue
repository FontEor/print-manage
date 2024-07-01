<template>
  <div class="plugin-list-container">
    <List
      :request-fn="requestV1.messagePushList"
      :query="query"
      ref="listRef"
      :offsetHeight="118"
      :sizes="[20, 50, 100, 200, 1000, 3000, 5000]"
    >
      <template #search>
        <el-form-item>
          <el-select clearable v-model="query.params.status" class="m-2" placeholder="选择状态">
            <el-option
              v-for="item in stateEnumList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd()" type="primary">
          <el-icon><Plus /></el-icon>&ensp;创建消息
        </el-button>
      </template>
      <template #table>
        <el-table-column type="index" min-width="60px" label="序号" />
        <el-table-column prop="name" label="消息名称" min-width="120px" />
        <el-table-column prop="type" label="推送类型" min-width="150px">
          <template #default="scope">
            <span>{{ formatMessageType(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="展示时机" min-width="100px">
          <template #default="scope">
            <span>{{ formatMessageAction(scope.row.action) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="定时时间" min-width="100px">
          <template #default="scope">
            <span>{{ scope.row.action === 2 ? scope.row.time : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isRepeat" label="是否重复展示" min-width="120px">
          <template #default="scope">
            <span>{{ formatMessageIsRepeat(scope.row.isRepeat) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="停留时长(秒)" min-width="120px" />
        <el-table-column prop="touchRate" label="触达率" min-width="100px">
          <template #default="scope">
            <span>{{ formatPercentage(scope.row.touchRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clickRate" label="点击率" min-width="100px">
          <template #default="scope">
            <span>{{ formatPercentage(scope.row.clickRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100px">
          <template #default="scope">
            <span>{{ formatMessageState(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="examiner" label="审核人" min-width="100px" />
        <el-table-column prop="createTime" label="创建时间" min-width="180px" />
        <el-table-column prop="examineTime" label="审核时间" min-width="180px" />
        <el-table-column prop="id" label="操作" width="170px">
          <template #default="scope">
            <el-button link type="primary" @click="onDetail(scope.row)">详情</el-button>
            <el-button
              v-show="scope.row.status === 3"
              link
              type="primary"
              @click="onEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-show="scope.row.status === 1 && scope.row.showAuditButton === 1"
              link
              type="primary"
              @click="onExamine(scope.row)"
              >审核</el-button
            >
            <el-button
              v-show="scope.row.status === 2"
              link
              type="primary"
              @click="onStop(scope.row)"
              >关闭</el-button
            >
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog
      :visible="state.showCreate"
      :action="state.dialogAction"
      :data="state.instance"
      @closed="onClosed"
    />
  </div>
</template>

<script setup lang="ts" name="SourceList">
  import { ref, reactive, ComponentPublicInstance } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';

  import List from '../../../components/List.vue';
  import CreateDialog from './MessagePushCreate.vue';

  import { requestV1 } from '@/axios/request';
  import { PluginForceUpdate } from '../../../types/apis/plugin.d';

  import {
    states as stateEnumList,
    formatMessageType,
    formatMessageAction,
    formatMessageIsRepeat,
    formatMessageState,
  } from '../../../enums/messagePush';

  import { formatPercentage } from '../../../utils/format/percentage';
  import { MessagePush } from '../../../types/apis/messagePush';

  // 查询条件数据
  const query: MessagePush.ListAxios = reactive({
    params: {
      status: undefined,
    },
  });

  // data数据
  const state = reactive({
    showCreate: false,
    showDetail: false,

    dialogAction: 'create',
    instance: undefined as MessagePush.Instance | undefined,
  });

  // 重置查询
  // const onResetQuery = () => {
  //   query.params.status = undefined;
  //   listRef.value?.getList();
  // };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List & { getList: Function }>>();

  const onEdit = (data: MessagePush.Instance) => {
    requestV1
      .messagePushDetail({
        replacements: {
          id: data.id,
        },
      })
      .then((response) => {
        state.instance = response.data;
        state.dialogAction = 'edit';
        state.showCreate = true;
      });
  };

  const onAdd = () => {
    state.showCreate = true;
    state.dialogAction = 'create';
  };

  const onExamine = (data: MessagePush.Instance) => {
    const options: MessagePush.ExamineAxios = {
      data: {
        id: data.id,
        // 默认通过
        status: 2,
      },
    };
    ElMessageBox.confirm(`请认真确认消息内容是否合规？`, '消息审核', {
      confirmButtonText: '审核通过',
      cancelButtonText: '审核不通过',
      distinguishCancelAndClose: true,
    })
      .then(() => {
        requestV1.messagePushExamine(options).then(() => {
          ElMessage.success('审核成功, 结果:通过');
          listRef.value?.getList();
        });
      })
      .catch((action) => {
        if (action === 'cancel') {
          options.data.status = 3;
          requestV1.messagePushExamine(options).then(() => {
            ElMessage.warning('审核成功, 结果:不通过');
            listRef.value?.getList();
          });
        }
      });
  };

  const onStop = (data: MessagePush.Instance) => {
    const options: MessagePush.ExamineAxios = {
      data: {
        id: data.id,
        status: 4,
      },
    };
    ElMessageBox.confirm(`确实关闭此消息`, '关闭消息', {
      confirmButtonText: '关闭',
      cancelButtonText: '取消',
      distinguishCancelAndClose: true,
    })
      .then(() => {
        requestV1.messagePushExamine(options).then(() => {
          ElMessage.success('关闭成功');
          listRef.value?.getList();
        });
      })
      .catch((action) => {});
  };

  const onDetail = (data: PluginForceUpdate.Instance) => {
    requestV1
      .messagePushDetail({
        replacements: {
          id: data.id,
        },
      })
      .then((response) => {
        response.data.content = encodeURIComponent(response.data.content);
        state.instance = response.data;
        state.dialogAction = 'info';
        state.showCreate = true;
      });
  };

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    if (refresh) {
      listRef.value?.getList();
    }
    state.showCreate = false;
  };
</script>
<script lang="ts">
  export default {
    name: 'MessagePush',
  };
</script>
