<template>
  <el-dialog v-model="state.innerVisible" title="面单预览" width="80%" :before-close="onClose">
    <!-- 步骤条 -->
    <el-steps :active="2" align-center>
      <el-step
        v-for="status in state.status"
        :title="status.title"
        :status="status.status"
        direction="vertical"
      >
        <template #description>
          {{ status.description }}
          <span v-show="status.templateURL">
            <a :href="status.templateURL" target="_blank">点击查看</a>
          </span>
        </template>
      </el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs class="image-view-tabs" v-model="state.currentTab" type="border-card">
      <!-- 预览 -->
      <el-tab-pane label="模板预览" name="preview">
        <el-image
          style="width: auto; height: 400px"
          :style="{
            opacity: state.base64 ? 1 : 0,
          }"
          :src="state.base64"
          :preview-src-list="[state.base64]"
          fit="contain"
        />
      </el-tab-pane>
      <!-- 配置 -->
      <el-tab-pane label="手动配置" name="config">
        <el-alert
          title="流程错误时才有必要配置:第一步解析数据失败时,此配置无效"
          style="margin-bottom: 10px"
          type="error"
          :closable="false"
        />
        <el-alert
          title="下载模板失败可在此手动填入模板内容数据"
          style="margin-bottom: 10px"
          type="warning"
          :closable="false"
        />
        <el-form ref="form" :model="state" label-width="120px">
          <el-form-item label="标准模板内容">
            <el-input type="textarea" v-model="state.templateContent" rows="5" />
          </el-form-item>
          <el-form-item label="自定义模板内容">
            <el-input type="textarea" v-model="state.customTempContent" rows="5" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSaveTemplateContent"
              >保存，跳过下载模板内容步骤</el-button
            >
            <el-button @click="onResetTemplateContent">清空数据</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ElDialog, ElSteps, ElStep, ElButton, ElMessage } from 'element-plus';
  import { reactive } from 'vue';
  import { PropType, watch } from 'vue';
  import {
    initStatus,
    changeDescription,
    changeStatus,
    formatAllData,
    formatPrintData,
    downloadTemplateContent,
    previewRequest,
  } from './status';
  import { stat } from 'fs';
  import { fromPairs } from 'lodash';

  const props = defineProps({
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    json: {
      type: String,
      default: '',
    },
  });

  const state = reactive({
    innerVisible: false,
    status: initStatus(),
    base64: '',
    currentTab: 'preview',
    templateContent: '', // 手动录入模板数据
    customTempContent: '', // 手动录入模板数据
  });

  const emits = defineEmits(['update:visible']);

  watch(
    () => props.visible,
    (value: boolean) => {
      if (value) {
        onStart();
      }
      if (value !== state.innerVisible) {
        state.innerVisible = value;
      }
    },
  );

  const onClose = () => {
    state.innerVisible = false;
    emits('update:visible', false);
  };

  // printMessage.url printType === ’server‘

  const onSaveTemplateContent = async () => {
    try {
      state.base64 = '';
      state.status = initStatus();
      // 解析报文数据 0
      const data = formatAllData(state.status, props.json);
      changeDescription(state.status, 1, '无需下载标准模板');
      changeStatus(state.status, 1, 'wait');
      changeDescription(state.status, 2, '无需下载自定义模板');
      changeStatus(state.status, 2, 'wait');
      // 解析数据 3
      const printData = formatPrintData(state.status, data.printData);
      // 发送预览请求 4
      const response = await previewRequest(state.status, {
        simpData: printData,
        tempUrl: data.standardTemplateName,
        customTempContent: data.customData,
        customTempUrl: state.customTempContent,
        // templateContent: state.templateContent,
        clientType: data.sys,
        clientVersion: data.clientVersion,
      });
      state.base64 = response.data;
      state.currentTab = 'preview';
      // 请求完成 5
      changeStatus(state.status, 5, 'success');
    } catch (error) {
      console.log('预览失败');
    }
  };

  const onResetTemplateContent = () => {
    state.templateContent = '';
    state.customTempContent = '';
  };

  const onStart = async () => {
    try {
      state.currentTab = 'preview';
      state.base64 = '';
      state.status = initStatus();
      // 解析报文数据 0
      const data = formatAllData(state.status, props.json);
      // 下载模板内容 1
      const templateContent = await downloadTemplateContent(state.status, data.tempUrl);
      // 下载自定义区域模板 2
      let customTempContent = '';
      if (data.customTempUrl) {
        try {
          customTempContent = await downloadTemplateContent(state.status, data.customTempUrl, 2);
        } catch (error) {
          changeDescription(state.status, 2, '自定义模板下载失败');
          changeStatus(state.status, 2, 'error');
        }
      } else {
        changeDescription(state.status, 2, '无需下载自定义模板');
        changeStatus(state.status, 2, 'success');
      }
      console.log('####### 打他他他他', data);
      // 解析数据 3
      const printData = formatPrintData(state.status, data.printData);
      // 发送预览请求 4
      const response = await previewRequest(state.status, {
        simpData: printData,
        tempUrl: data.standardTemplateName,
        customTempContent: data.customData,
        customTempUrl: data.customTempUrl,
        // templateContent: templateContent,
        clientType: data.sys,
        clientVersion: data.clientVersion,
      });
      state.base64 = response.data;
      state.currentTab = 'preview';
      // 请求完成 5
      changeStatus(state.status, 5, 'success');
    } catch (error) {
      console.log('error', error);
      ElMessage.error('预览失败');
    }
  };
</script>
<script lang="ts">
  export default {
    name: 'LogsImageView',
  };
</script>
