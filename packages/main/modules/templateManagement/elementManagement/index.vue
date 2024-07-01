<template>
  <div class="element-management">
    <List :request-fn="requestV1.elementList" :query="query" ref="listRef">
      <template #search>
        <el-form-item>
          <el-select v-model="query.params.sourceId" placeholder="选择数据源" clearable>
            <el-option
              v-for="source in state.sourceOptions"
              :key="source.id"
              :label="source.name"
              :value="`${source.id}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.params.name" placeholder="输入要素名称查询" />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="dialogFormVisible = true" type="primary">
          <el-icon><Plus /></el-icon>&ensp;创建要素
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="要素名称" />
        <el-table-column label="数据源">
          <template #default="scope">
            <span>{{ scope.row.sourceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="要素类型">
          <template #default="scope">
            <span>{{ formatElementType(scope.row.elementType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fixedValue" label="要素值">
          <template #default="scope">
            <span v-show="scope.row.valueType === 0">{{
              scope.row.propertyPath ? scope.row.propertyPath : '-'
            }}</span>
            <span v-show="scope.row.valueType === 1">{{
              scope.row.fixedValue ? scope.row.fixedValue : '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填">
          <template #default="scope">
            <span>{{ scope.row.required === 1 ? '必填' : '非必填' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="更新人ERP" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button-group>
              <el-button link type="primary" @click="checkOverview(scope.row, 'overview')"
                >详情</el-button
              >
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </template>
    </List>
    <!-- 创建模板弹窗 -->
    <CreatElementDialog v-model:dialogFormVisible="dialogFormVisible" @closed="handleClosed" />
    <!-- 删除弹窗 -->
    <el-dialog v-model="deleteDialogVisible" center title="删除提示" width="400px">
      <!-- <div class="dialog-content" v-if="!state.showDelete">
        <p>该要素已被绑定为{{ state.templateString }}模板的校验要素，</p>
        <p>删除后，将不再校验，您确认删除吗？</p>
      </div> -->
      <div class="dialog-content">
        <p>与此要素同一类型的模板，都将不再校验此要素</p>
        <p>您确认要删除吗？</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmDelete">删除</el-button>
          <el-button @click="deleteDialogVisible = false">不删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, ComponentPublicInstance, onMounted } from 'vue';
  import { requestV1 } from '@/axios/request';
  import List from '../../../components/List.vue';
  import type { elementData } from '../../../types/apis/elementData';
  import { SystemData } from '../../../types/apis/systemData';
  import CreatElementDialog from './createElementDialog.vue';
  import { router } from '../../../router';
  import { ElMessage } from 'element-plus';
  import selectListMixins from '../../../mixins/selectList';
  import { openTemplateData } from '../../../types/apis/openTemplateData';
  import { Business } from '../../../types/apis/business';
  import { Session } from '../../../utils/session';
  import { SourceData } from '../../../types/apis/sourceData';

  const dialogFormVisible = ref(false);
  const deleteDialogVisible = ref(false);
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  interface objectType {
    [key: string]: any;
  }

  // 查询条件数据
  const query: elementData.ListQueryAxios = reactive({
    params: {
      orgId: Session.getOrgId(),
      name: '',
      sourceId: '',
    },
  });

  const state = reactive({
    value: '',
    showDelete: false,
    elementId: '',
    templateString: '',
    sourceOptions: [] as SourceData.Instance[],
  });

  const { getSourceList, formatElementType } = selectListMixins(state);

  onMounted(() => {
    getSourceList();
  });

  const handleClosed = (refresh = false) => {
    dialogFormVisible.value = false;
    if (refresh) {
      listRef.value?.getList();
    }
  };

  // 查看概览
  const checkOverview = (data: elementData.Instance, tag: string) => {
    router.push({
      name: 'ElementDetail',
      query: {
        id: data.orgId,
        elementId: data.id,
        tag,
      },
    });
  };

  // 删除前验证
  const handleDelete = async (row: elementData.Instance) => {
    const params = { checkFlag: true };
    const replacements = { elementId: row.id };
    const response = await requestV1.elementDelete({ params, replacements }).catch(() => {
      throw new Error('删除接口异常');
    });
    const { hasTemplate, templateString } = response.data;
    hasTemplate === 0 ? (state.showDelete = false) : (state.showDelete = true);
    state.templateString = templateString;
    state.elementId = row.id;
    deleteDialogVisible.value = true;
  };

  //确认删除
  const confirmDelete = async () => {
    const params = { checkFlag: false };
    const replacements = { elementId: state.elementId };
    const response = await requestV1
      .elementDelete({
        params,
        replacements,
      })
      .catch(() => {
        throw new Error('删除接口异常');
      });
    deleteDialogVisible.value = false;
    ElMessage.success('删除成功');
    listRef.value?.getList();
  };
</script>

<style lang="less" scoped>
  .element-management {
    .dialog-content {
      line-height: 30px;
    }

    .el-button-group {
      :deep(.el-button) {
        margin: 0 5px;
      }
    }
  }
</style>
