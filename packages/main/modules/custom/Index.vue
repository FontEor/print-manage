<template>
  <div class="custom-management">
    <List :request-fn="requestV1.customList" :query="query" ref="listRef">
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
          <el-input
            v-model="query.params.tempNameOrCode"
            placeholder="输入模板名称或模板编码查询"
          />
        </el-form-item>
      </template>
      <template #active>
        <el-button @click="onAdd" type="primary">
          <el-icon><Plus /></el-icon>&ensp;新建半自定义模板
        </el-button>
      </template>
      <template #table>
        <el-table-column prop="code" label="模板编码" min-width="140px" />
        <el-table-column prop="name" label="模板名称" min-width="140px" />
        <el-table-column prop="deliveryCode" label="承运商类型" min-width="140px">
          <template #default="scope">
            <span>{{ formatDeliveryCode(scope.row.deliveryCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗材尺寸">
          <template #default="scope">
            <span>{{ scope.row.width + 'mm x ' + scope.row.height + 'mm' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="更新人ERP" min-width="100px" />
        <el-table-column prop="updateTime" label="更新时间" width="180px" />
        <el-table-column label="操作" width="280px">
          <template #default="scope">
            <el-button link type="primary" @click="checkOverview(scope.row, 'overview')"
              >概览</el-button
            >
            <el-button link type="primary" @click="checkOverview(scope.row, 'versionManagement')"
              >版本管理</el-button
            >
            <el-button link type="primary" @click="drawTemplate(scope.row)">绘制模板</el-button>
            <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
            <!-- <el-popconfirm title="确认删除此记录?" width="160px" @cancel="() => {}" @confirm="handleDelete(scope.row)">
              <template #reference>
                <el-button link type="primary" >删除</el-button>
              </template>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </template>
    </List>
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
  import List from '../../components/List.vue';
  import type { openTemplateData } from '../../types/apis/openTemplateData';
  import { SystemData } from '../../types/apis/systemData';
  import { router } from '../../router';
  import { ElMessage } from 'element-plus';
  import selectListMixins from '../../mixins/selectList';
  import { Custom } from '../../types/apis/custom';
  import { TemplateImages } from '../../types/apis/template';
  import { Standard } from '../../types/apis/standard';
  import { Session } from '../../utils/session';
  import { SourceData } from '../../types/apis/sourceData';
  import { Version } from '../../types/apis/version';

  const deleteDialogVisible = ref(false);

  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // 查询条件数据
  const query: Custom.ListQueryAxios = reactive({
    params: {
      tempId: '',
      orgId: Session.getOrgId(),
      deliveryCode: '',
      tempNameOrCode: '',
    },
  });

  const state = reactive({
    value: '',
    showDelete: false,
    specifIdOptions: [] as openTemplateData.Instance[], //面单类型
    deliveryCodeOptions: [] as openTemplateData.Instance[], //承运商
    standardOptions: [] as Standard.Instance[], // 可用的标准模板列表
    orgId: Session.getOrgId(),
    temId: '',
  });

  const { getOrgList, getDeliveryList, getUserStandardList, formatDeliveryCode } =
    selectListMixins(state);

  onMounted(() => {
    getOrgList();
    getDeliveryList();
    getUserStandardList();
  });

  // 查看概览
  const checkOverview = (data: openTemplateData.Instance, tag: string) => {
    router.push({
      name: 'CustomDetail',
      query: {
        id: data.orgId,
        temId: data.id,
        tag,
      },
    });
  };

  // 删除前验证
  const handleDelete = async (row: openTemplateData.Instance) => {
    const params = { checkFlag: 1 };
    const replacements = { id: row.orgId, temId: row.id };
    const response = await requestV1.customDelete({ params, replacements }).catch(() => {
      throw new Error('删除接口异常');
    });
    const { hasPublishTemp } = response.data;
    hasPublishTemp === 1 ? (state.showDelete = false) : (state.showDelete = true);
    state.orgId = `${row.orgId}`;
    state.temId = row.id;
    deleteDialogVisible.value = true;
  };

  //确认删除
  const confirmDelete = async () => {
    const params = { checkFlag: 0 };
    const replacements = { id: state.orgId, temId: state.temId };
    const response = await requestV1
      .customDelete({
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

  // 跳转添加模板
  const onAdd = () => {
    router.push({
      name: 'CustomTemplateAdd',
      query: {
        hasCustom: 1,
      },
    });
  };

  const drawTemplate = (row: Custom.Instance) => {
    requestV1
      .versionList({
        params: { from: 1, size: 3, tempType: 2 },
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
          `/editor/?tempType=2&orgId=${row.orgId}&temId=${row.tempId}&sourceId=${
            row.sourceId || ''
          }&verId=${lastVersionId || ''}&cid=${row.id}&templateCode=${row.code}`,
          '_blank',
        );
      });
  };
</script>
