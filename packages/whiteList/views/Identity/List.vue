<template>
  <div class="white-list-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>快递业务白名单商家认证</span>
          <el-button @click="onCreate(4)" class="button" type="primary" link :icon="Plus"
            >去认证新应用</el-button
          >
        </div>
      </template>
      <el-table
        stripe
        height="500"
        empty-text="暂无认证应用"
        :data="state.expressList"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="sysName" label="系统名称" width="200" align="center" />
        <el-table-column prop="appKey" label="appKey" width="280" align="center" />
        <el-table-column prop="status" label="状态" width="180" align="center">
          <template #default="scope">
            <el-tag :type="statusTypeFilter(scope.row.status)">{{
              statusFilter(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template #default="scope">
            <el-button size="large" type="primary" link @click="onDetail(scope.row, 4)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>快运业务白名单商家认证</span>
          <el-button @click="onCreate(5)" class="button" type="primary" link :icon="Plus"
            >去认证新应用</el-button
          >
        </div>
      </template>
      <el-table
        stripe
        height="500"
        empty-text="暂无认证应用"
        :data="state.fastList"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="sysName" label="系统名称" width="200" align="center" />
        <el-table-column prop="appKey" label="appKey" width="280" align="center" />
        <el-table-column prop="status" label="状态" width="180" align="center">
          <template #default="scope">
            <el-tag :type="statusTypeFilter(scope.row.status)">{{
              statusFilter(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template #default="scope">
            <el-button size="large" type="primary" link @click="onDetail(scope.row, 5)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { Plus } from '@element-plus/icons-vue';
  import { request } from '../../axios';
  import { ElMessage } from 'element-plus';
  import { statusFilter, statusTypeFilter } from './filters';
  import { WhiteList } from '../../types/apis/whiteList';
  import { router } from '../../router';

  const state = reactive({
    expressList: [] as WhiteList.Instance[],
    fastList: [] as WhiteList.Instance[],
  });

  const getList = (scene: number) => {
    const config: WhiteList.ListQueryAxios = {
      params: {
        pinType: 1,
        scene,
        isPage: 0,
      },
    };
    request.whiteExamineOuterList(config).then((response) => {
      const { code, message, data } = response;
      console.log('response', response);
      if (code === 200) {
        switch (scene) {
          case 4:
            state.expressList = data;
            break;
          case 5:
            state.fastList = data;
        }
      } else {
        ElMessage.error(message);
      }
    });
  };

  const onCreate = (scene: number) => {
    router.push({
      name: 'Identify',
      query: {
        scene: scene,
      },
    });
  };

  const onDetail = (data: WhiteList.Instance, scene: number) => {
    router.push({
      name: 'Identify',
      query: {
        id: data.id,
        scene: scene,
      },
    });
  };

  defineExpose({
    getList,
  });
</script>
<script lang="ts">
  import { defineComponent } from 'vue';

  defineComponent({
    beforeRouteEnter(to, form, next) {
      next((vm) => {
        vm.getList(4);
        vm.getList(5);
        try {
          document.getElementsByTagName('main')[0].scrollTop = 0;
        } catch (e) {}
      });
    },
  });
</script>
