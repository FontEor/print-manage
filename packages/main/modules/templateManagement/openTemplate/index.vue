<template>
  <div class="template-management">
    <List :request-fn="requestV1.openTemplateList" :query="query" ref="listRef">
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
          <el-select v-model="query.params.sourceId" placeholder="选择数据源" clearable>
            <el-option
              v-for="source in state.sourceOptions"
              :key="source.id"
              :label="source.name"
              :value="`${source.id}`"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select
            clearable
            v-model="query.params.specifId"
            class="m-2"
            placeholder="选择面单类型"
           
          >
            <el-option
              v-for="item in state.specifIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-input v-model="query.params.codeOrName" placeholder="输入模板名称或模板编码查询" />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="handleAccess" type="primary">
          <el-icon><Plus /></el-icon>&ensp;新建全自定义模板
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="code" label="模板编码" />
        <el-table-column prop="name" label="模板名称" />
        <el-table-column label="数据源">
          <template #default="scope">
            <span>{{ scope.row.sourceName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryCode" label="承运商类型">
          <template #default="scope">
            <span>{{ formatDeliveryCode(scope.row.deliveryCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗材尺寸">
          <template #default="scope">
            <span>{{ scope.row.width + 'mm x ' + scope.row.height + 'mm' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="更新人ERP" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" width="280px">
          <template #default="scope">
            <el-button-group>
              <el-button link type="primary" @click="checkOverview(scope.row, 'overview')"
                >概览</el-button
              >
              <el-button link type="primary" @click="checkOverview(scope.row, 'versionManagement')"
                >版本管理</el-button
              >
              <el-button link type="primary" @click="drawTemplate(scope.row)">绘制模板</el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </template>
    </List>
    <!-- 创建模板弹窗 -->
    <CreateTemplateDialog
      v-model:dialogFormVisible="dialogFormVisible"
      :specifIdOptions="state.specifIdOptions"
      :deliveryCodeOptions="state.deliveryCodeOptions"
      @closed="handleClosed"
    />
    <!-- 删除弹窗 -->
    <el-dialog v-model="deleteDialogVisible" center title="删除提示" width="400px">
      <div class="dialog-content" v-if="!state.showDelete">
        <p>当前模板含默认版本，</p>
        <p>直接删除会影响用户使用。</p>
      </div>
      <div class="dialog-content" v-else>
        <p>该模板的基础信息及所有版本的模板样式</p>
        <p>都将被删除，您确认删除吗？</p>
      </div>
      <template #footer>
        <span v-if="!state.showDelete" class="dialog-footer">
          <el-button type="primary" @click="deleteDialogVisible = false">关闭</el-button>
        </span>
        <span v-else class="dialog-footer">
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
  import type { openTemplateData } from '../../../types/apis/openTemplateData';
  import CreateTemplateDialog from './createTemplateDialog.vue';
  import { router } from '../../../router';
  import { ElMessage } from 'element-plus';
  import selectListMixins from '../../../mixins/selectList';
  import { Session } from '../../../utils/session';
  import { SourceData } from '../../../types/apis/sourceData';
  import { Version } from '../../../types/apis/version';

  const dialogFormVisible = ref(false);
  const deleteDialogVisible = ref(false);
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // interface objectType {
  //   [key: string]: any;
  // }

  // 查询条件数据
  const query: openTemplateData.ListQueryAxios = reactive({
    params: {
      id: Session.getOrgId(),
      codeOrName: '',
      sourceId: '',
      specifId: '',
      deliveryCode: '',
    },
  });

  const state = reactive({
    value: '',
    showDelete: false,
    specifIdOptions: [] as openTemplateData.Instance[], //面单类型
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    sourceOptions: [] as SourceData.Instance[], // 数据源
    orgId: 0,
    temId: '',
  });

  const { getTempSpecifsList, getSourceList, getDeliveryList, formatDeliveryCode } =
    selectListMixins(state);

  onMounted(() => {
    getTempSpecifsList();
    getSourceList(Session.getOrgId());
    getDeliveryList();
  });

  const handleAccess = () => {
    dialogFormVisible.value = true;
  };

  const handleClosed = (refresh = false) => {
    dialogFormVisible.value = false;
    if (refresh) {
      listRef.value?.getList();
    }
  };

  // 查看概览
  const checkOverview = (data: openTemplateData.Instance, tag: string) => {
    router.push({
      name: 'OpenTemplateDetail',
      query: {
        id: Session.getOrgId(),
        temId: data.id,
        tag,
      },
    });
  };

  // 删除前验证
  const handleDelete = async (row: openTemplateData.Instance) => {
    const params = { checkFlag: 1 };
    const replacements = { id: row.orgId, temId: row.id };
    const response = await requestV1.openTemplateDelete({ params, replacements }).catch(() => {
      throw new Error('删除接口异常');
    });
    const { hasPublishTemp } = response.data;
    hasPublishTemp === 1 ? (state.showDelete = false) : (state.showDelete = true);
    state.orgId = row.orgId;
    state.temId = row.id;
    deleteDialogVisible.value = true;
  };

  //确认删除
  const confirmDelete = async () => {
    const params = { checkFlag: 0 };
    const replacements = { id: state.orgId, temId: state.temId };
    const response = await requestV1
      .openTemplateDelete({
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

  const drawTemplate = (row: openTemplateData.Instance) => {
    requestV1
      .versionList({
        params: { from: 1, size: 3, tempType: 1 },
        replacements: { id: row.orgId, temId: row.id },
      })
      .then((response) => {
        // 获取最新模板版本ID
        const versions: Version.Instance[] = response.data || [];
        let lastVersionId = 0;
        versions.reduce((total, version) => {
          if (total < version.tempVersion) {
            total = version.tempVersion;
            lastVersionId = version.id;
          }
          return total;
        }, 0);
        window.open(
          `/editor/?tempType=1&orgId=${row.orgId}&temId=${row.id}&sourceId=${
            row.sourceId || ''
          }&verId=${lastVersionId || ''}&templateCode=${row.code}`,
          '_blank',
        );
      });
  };
</script>

<style lang="less" scoped>
  .template-management {
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
