<template>
  <div class="page-logs account-list-container">
    <List :request-fn="requestV1.logsList" :query="query" query-position="data" ref="listRef">
      <template #search>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.waybillNumber" placeholder="运单号" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.pin" placeholder="京东PIN" />
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="query.data.serviceMerchant"
            class="m-2"
            placeholder="物流服务商"
          >
            <el-option
              v-for="item in state.deliveryCodeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.taskId" placeholder="打印任务ID" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.pluginVersionCode" placeholder="插件版本号" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-date-picker
            v-model="query.data.printTimes"
            type="datetimerange"
            range-separator="至"
            start-placeholder="打印起始时间"
            end-placeholder="打印截止时间"
            placeholder="打印时间"
            format="YYYY-MM-DD HH:mm:ss"
            :default-time="datetimes"
          />
        </el-form-item>
        <el-form-item label="" label-width="0px" class="double-input">
          <el-input-number
            v-model="query.data.timeConsumingStart"
            :controls="false"
            :min="0"
            :max="query.data.timeConsumingEnd"
            placeholder="数据时延下限"
          />
          <span>至</span>
          <el-input-number
            v-model="query.data.timeConsumingEnd"
            :controls="false"
            :min="query.data.timeConsumingStart"
            placeholder="数据时延上限"
          />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-select
            clearable
            v-model="query.data.tempUrlHostType"
            class="m-2"
            placeholder="标准模板类型"
          >
            <el-option label="全部" value="" />
            <el-option label="京东域名的标准模板" value="1" />
            <el-option label="非京东域名的标准模板" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.standardTemplateName" placeholder="标准模板URL" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.customizeTemplateName" placeholder="自定义区URL" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.printStatus" placeholder="错误码" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.data.machineId" placeholder="机器ID" />
        </el-form-item>
        <el-form-item label="" label-width="0px">
          <el-select
            clearable
            v-model="query.data.templatePlatform"
            class="m-2"
            placeholder="是否新版面单"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="3.0" />
            <el-option label="否" value="2.0" />
          </el-select>
        </el-form-item>
      </template>

      <template #table>
        <el-table-column type="index" width="80" label="序号" />
        <el-table-column prop="taskId" label="打印任务ID" min-width="120px" />
        <el-table-column prop="pin" label="京东PIN" min-width="100px" />
        <el-table-column prop="waybillNumber" label="运单号" min-width="100px" />
        <el-table-column prop="serviceMerchant" label="物流服务商" min-width="100px">
          <template #default="scope">
            <span>{{ formatDeliveryCode(scope.row.serviceMerchant) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="timeConsuming" label="打印数据获取时延(ms)" min-width="100px" />
        <el-table-column prop="printTime" label="打印时间" min-width="100px" />
        <el-table-column prop="pluginVersionCode" label="插件版本号" min-width="100px" />
        <el-table-column prop="machineId" label="机器ID" min-width="100px" />
        <el-table-column prop="standardTemplateName" label="标准模板URL" min-width="110px" />
        <el-table-column prop="customizeTemplateName" label="自定义区URL" min-width="110px" />
        <el-table-column prop="templatePlatform" label="是否新版面单" min-width="110px">
          <template #default="scope">
            <span>{{ scope.row.templatePlatform === '3.0' ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作" width="140px">
          <template #default="scope">
            <el-button link type="primary" @click="onDetail(scope.row)">查看打印报文</el-button>
            <el-button link type="primary" @click="onPreview(scope.row)">查看面单</el-button>
          </template>
        </el-table-column>
      </template>
    </List>
    <JsonView
      v-model:visible="state.jsonDialogVisible"
      @update:visible="state.jsonDialogVisible = $event"
      :json="state.detail?.data"
      :confirm-fn="onConfirm"
    />
    <ImageView
      v-model:visible="state.imageDialogVisible"
      @update:visible="state.imageDialogVisible = $event"
      :json="state.detail?.data"
    />
  </div>
</template>

<script setup lang="ts" name="SourceList">
  import { ref, reactive, ComponentPublicInstance, onMounted } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { get } from 'lodash';

  import List from '../../components/List.vue';

  import type { Logs } from '../../types/apis/logs';
  import type { openTemplateData } from '../../types/apis/openTemplateData';
  import { requestV1 } from '@/axios/request';
  import selectListMixins from '../../mixins/selectList';
  import { datetimes } from '../../mixins/defaultVar';
  import { openNewTab } from '../../utils/download';

  import JsonView from './JsonView.vue';
  import ImageView from './ImageView.vue';

  const initQuery = function (): Logs.ListQuery {
    return {
      customizeTemplateName: '', // 自定义模板名称
      pin: '',
      pluginVersionCode: '', // 插件版本号
      serviceMerchant: '', // 物流服务商
      standardTemplateName: '', // 标准模板名称
      taskId: '', // 任务id
      timeConsumingEnd: undefined, // 耗时上限
      timeConsumingStart: undefined, // 耗时下限
      waybillNumber: '', // 运单号
      printTimes: [], //	首次安装时间
      printStatus: '', // 错误码
      machineId: undefined, // 机器ID
      tempUrlHostType: undefined, // 标准模板类型
      templatePlatform: '', // 是否新面单
    };
  };

  // 查询条件数据
  const query: Logs.ListQueryAxios = reactive({
    data: initQuery(),
  });

  // data数据
  const state = reactive({
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    jsonDialogVisible: false,
    imageDialogVisible: false,
    detail: undefined as Logs.Instance | undefined,
  });

  const { getDeliveryList, formatDeliveryCode } = selectListMixins(state);

  // 重置查询
  const onResetQuery = () => {
    query.data = initQuery();
    listRef.value?.getList();
  };

  onMounted(() => {
    getDeliveryList();
  });

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const onDetail = (data: Logs.Instance) => {
    state.detail = data;
    state.jsonDialogVisible = true;
  };

  const onConfirm = () => {
    state.jsonDialogVisible = false;
  };

  // 查看面单
  const onPreview = (data: Logs.Instance) => {
    // 如果是服务端渲染
    try {
      const json = JSON.parse(data.data);
      if (json.printType === 'server') {
        if (json.isSuccess === 'true') {
          console.log(json);
          const result: Logs.PrintMessage = JSON.parse(json.printMessage);
          console.log('pdf url', result);
          const url = get(result, 'result[0].url', '');
          if (url) {
            openNewTab(url);
          } else {
            ElMessage.error('PDF地址提取失败，请查看报文');
          }
        } else {
          ElMessage.error('服务端打印失败单据，请查看报文');
        }
      }
      // 否则客户端渲染
      else {
        state.detail = data;
        state.imageDialogVisible = true;
      }
    } catch (error) {
      return ElMessage.error('报文无法解析');
    }
  };

  defineExpose({
    resetQuery: onResetQuery,
  });
</script>
<script lang="ts">
  export default {
    name: 'PluginInstall',
  };
</script>
