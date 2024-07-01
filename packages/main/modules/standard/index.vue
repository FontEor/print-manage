<template>
  <div class="standard-management-user">
    <List :request-fn="requestV1.userTemplateList" :query="query" ref="listRef">
      <template #search>
        <el-form-item>
          <el-select
            clearable
            v-model="query.params.deliveryCode"
            class="m-2"
            placeholder="选择承运商"
          >
            <el-option
              v-for="item in state.deliveryCodeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.params.tempCode" placeholder="输入模板编码查询" />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd" type="primary">
          <el-icon><Plus /></el-icon>&ensp;选用标准模板
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="tempCode" label="模板编码" />
        <el-table-column prop="tempName" label="模板名称" />
        <el-table-column prop="deliveryCode" label="承运商类型">
          <template #default="scope">
            <span>{{ formatDeliveryCode(scope.row.deliveryCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据源">
          <template #default="scope">
            <span>{{ scope.row.sourceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗材尺寸">
          <template #default="scope">
            <span>{{ scope.row.width + 'mm x ' + scope.row.height + 'mm' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button-group>
              <el-button link type="primary" @click="onPreview(scope.row)">预览</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </template>
    </List>
    <PreviewDialog
      :visible="state.previewVisible"
      :url="state.currentStandard.coverImage"
      @close="state.previewVisible = false"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, ComponentPublicInstance, onMounted } from 'vue';
  import { requestV1 } from '@/axios/request';
  import List from '../../components/List.vue';
  import type { openTemplateData } from '../../types/apis/openTemplateData';
  import { SystemData } from '../../types/apis/systemData';
  import { Standard } from '../../types/apis/standard';
  import PreviewDialog from './previewDialog.vue';
  import selectListMixins from '../../mixins/selectList';
  import { router } from '../../router';
  import { Business } from '../../types/apis/business';
  import { Session } from '../../utils/session';

  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // 查询条件数据
  const query: Standard.ListQueryAxios = reactive({
    params: {
      orgId: Session.getOrgId(),
      tempCode: '',
      // hasCustom: '0',
      deliveryCode: '',
    },
  });

  const state = reactive({
    specifIdOptions: [] as openTemplateData.Instance[], //面单类型
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    previewVisible: false,
    currentStandard: {} as Standard.Instance,
  });

  const { getOrgList, getDeliveryList, formatDeliveryCode } = selectListMixins(state);

  onMounted(() => {
    getOrgList();
    getDeliveryList();
  });

  // 预览
  const onPreview = (row: Standard.Instance) => {
    state.currentStandard = row;
    state.previewVisible = true;
  };

  // 跳转添加模板
  const onAdd = () => {
    router.push({
      name: 'StandardTemplateAdd',
      query: {
        // hasCustom: 0,
        skipCreate: 1,
      },
    });
  };
</script>
