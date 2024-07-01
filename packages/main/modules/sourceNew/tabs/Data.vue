<template>
  <div class="tab-list-container source-new-property flex-column-start">
    <div class="source-list-tools">
      <div class="source-list-tools-left">
        <el-button class="enums-manage-button" @click="enumsManage">枚举管理</el-button>
        <!-- <el-button @click="onImport">导入JSON</el-button> -->
      </div>
      <div class="source-list-tools-right">
        <el-input
          class="tools-right-search"
          v-model="query.params.propertyCodeAndName"
          placeholder="输入字段名或中文名，只支持查询一级子节点"
          :suffix-icon="Search"
          clearable
          @blur="onSearch"
          @keyup.enter="onSearch"
          @clear="onSearch"
        />
      </div>
    </div>
    <div
      v-if="!state?.tableData[0]?.children?.length && state.isSearch"
      class="flex-center"
      style="flex: 1; height: 100%; width: 100%; display: flex"
    >
      <EmptyTemplate :status="3" @cancel="cancelSearch" />
    </div>
    <div v-else class="source-list-content p-0">
      <div class="table-content">
        <el-table
          lazy
          ref="listRef"
          row-key="id"
          height="100%"
          :load="getList"
          class="input-table"
          style="width: 100%"
          :data="state.tableData"
          default-expand-all
          header-row-class-name="template-list-table-header"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="propertyCode" label="字段名" min-width="200px">
            <template #default="scope">
              <div class="source-expand-icon">
                <div
                  class="source-icon-increase"
                  v-if="!scope?.treeNode?.expanded && scope.row?.children?.length"
                  @click="handleRowClick(scope.row)"
                ></div>
                <div
                  class="source-icon-minus"
                  v-else-if="scope?.treeNode?.expanded"
                  @click="handleRowClick(scope.row)"
                ></div>
                <div v-else class="source-icon-none"></div>
                {{ scope.row.propertyCode }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="propertyName" label="中文名" min-width="200px" />
          <el-table-column prop="dataType" label="类型" min-width="100px">
            <template #default="scope">
              {{ state.dataTypes[scope.row.dataType].label || undefined }}
            </template>
          </el-table-column>
          <el-table-column prop="simpData" label="示例值" min-width="200px" />
          <el-table-column prop="remark" label="使用说明" min-width="200px" />
          <el-table-column prop="path" label="字段全路径" width="220px">
            <template #default="scope">
              <el-tooltip
                :visible="state.cellsShowPopover[scope.$index]"
                effect="dark"
                :content="scope.row.path"
                placement="top"
              >
                <div class="special-column">
                  {{ scope.row.path }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="enumItemName" label="枚举项名称" min-width="120px" />
          <el-table-column prop="updateUser" label="更新人" min-width="120px" />
          <el-table-column prop="updateTime" label="更新时间" min-width="200px" />
          <el-table-column
            prop="id"
            label="操作"
            width="236px"
            class-name="action-cell"
            fixed="right"
          >
            <template #default="scope">
              <div class="action-button-list">
                <el-button
                  v-if="scope.row.dataType !== 2"
                  class="none-foucus-button"
                  :disabled="!state.disabled"
                  link
                  type="primary"
                  @click="onAdd(scope.row)"
                  >增加字段</el-button
                >
                <el-button
                  v-if="scope.row.dataType !== 2"
                  class="none-foucus-button"
                  :disabled="!state.disabled"
                  link
                  type="primary"
                  @click="onImport(scope.row)"
                  >导入</el-button
                >
                <el-button
                  v-show="scope.$index !== 0"
                  class="none-foucus-button"
                  :disabled="!state.disabled"
                  link
                  type="primary"
                  @click="onEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-show="scope.$index !== 0"
                  class="none-foucus-button"
                  :disabled="!state.disabled"
                  link
                  type="primary"
                  @click="onDelete(scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <JsonDialog
      v-model:visible="state.importDialog"
      @update:visible="state.importDialog = $event"
      :confirm-fn="importConfirm"
    />
    <CreateDialog
      v-if="state.showCreate"
      :visible="state.showCreate"
      :enmus-list="state.enmusList"
      @closed="onClosed"
      :detail="props.detail"
      :property="state.currentProperty"
      :add-property="state.addProperty"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, ComponentPublicInstance, h, onMounted, nextTick } from 'vue';
  import type { PropType } from 'vue';

  import JsonDialog from '../../../components/json/JsonDialog.vue';
  import CreateDialog from './Create.vue';
  // import RelationDialog from './RelationDialog.vue';

  import { dataTypes } from '@/const/enums';

  import { requestV2 } from '@/axios/request';

  import { Property, SourceData } from '@/types/apis/sourceData';
  import { SourcePropertyNew, EnmusProperty } from '@/types/apis/source-new.d';
  import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
  import { CN_EN_NUM } from '@/const/regexp';
  import { Search } from '@element-plus/icons-vue';
  import { useRoute } from 'vue-router';
  import { useGo } from '@/hooks/web/usePage';
  import { Session } from '@/utils/session';
  import { EnumsManage } from '@/types/apis/enumManage';
  import EmptyTemplate from '@/components/EmptyTemplate.vue';

  const listRef = ref<ComponentPublicInstance<typeof ElTable>>();

  const props = defineProps({
    detail: {
      type: Object as PropType<SourceData.Instance>,
    },
  });
  const go = useGo();

  const route = useRoute();
  // 查询条件数据
  const query = reactive({
    params: {
      parentId: '',
      propertyCodeAndName: '',
    },
    replacements: {
      sourceId: route.query.sourceId || '',
      id: route.query.id || '',
    },
  } as Property.ListAxios);

  // data数据
  const state = reactive({
    showCreate: false,
    // showRelationDialog: false,
    importDialog: false,
    disabled: true,
    tableData: [] as Property.InstanceBySource[],
    root: {},
    currentProperty: undefined as undefined | Property.Instance,
    addProperty: undefined as undefined | SourcePropertyNew.AddProperty,
    treeData: [],
    dataTypes,
    CN_EN_NUM,
    enmusList: [] as EnmusProperty.Instance[],
    cells: undefined as unknown as NodeListOf<Element>,
    cellsShowPopover: [] as (boolean | undefined)[],
    isSearch: false, // 判断列表是否要进入搜索模式
  });

  // 查询条件数据
  const enumsQuery: EnumsManage.ListAxios = reactive({
    params: {
      isPage: 0,
      nameOrCode: '',
      orgId: Session.getOrgId(),
    },
  });
  // 获取枚举列表
  const getEnumsList = () => {
    requestV2.enumList(enumsQuery).then((response) => {
      state.enmusList = response.data;
    });
  };
  onMounted(() => {
    getEnumsList();
  });

  // 提取数据到query
  const pickData = (detail: SourceData.Instance) => {
    query.replacements.id = `${detail.orgId}`;
    query.replacements.sourceId = `${detail.id}`;
  };

  // 提取根节点数据
  const pickDataForProperty = (detail: SourceData.Instance): Property.InstanceBySource => {
    return {
      orgId: detail.orgId,
      id: 0,
      propertyCode: detail.code,
      propertyName: detail.name,
      dataType: 1, // 对象类型
      remark: detail.remark,
      path: detail.code,
      children: [],
      // 仿造数据 好像没有
      sourceId: detail.id,
      enumItemId: 0, // 枚举项ID
      enumItemName: '', // 枚举项名称
      updateTime: detail.updateTime,
      updateUser: detail.updateUser,
    };
  };

  // 监听详情字段
  watch(
    () => props.detail,
    (n) => {
      if (n) {
        pickData(n);
        getList();
      }
    },
    {
      immediate: true,
    },
  );

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    state.showCreate = false;
    state.addProperty = undefined;
    state.currentProperty = undefined;
    if (refresh && props.detail) {
      getList();
    }
  };

  // 添加字段
  const onAdd = (currentData: Property.Instance) => {
    console.log('add', currentData);
    state.addProperty = { parentId: currentData.id, sourceId: currentData.sourceId };
    state.showCreate = true;
  };

  // 编辑字段
  const onEdit = (currentData: Property.Instance) => {
    console.log('edit', currentData);
    state.currentProperty = currentData;
    state.showCreate = true;
  };

  const onConfirm = (data: Property.Instance) => {
    requestV2
      .propertyDelete({
        replacements: {
          proId: data.id,
          id: `${props.detail?.orgId}`,
          sourceId: `${data.sourceId}`,
        },
      })
      .then(() => {
        ElMessage.success('删除成功');
        getList();
      });
  };
  const onDelete = (data: Property.Instance) => {
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '是否确认删除'),
        h(
          'div',
          { class: 'el-message-box-confirm_content' },
          '本字段所有信息都将被删除，您确认要删除该数据源吗？',
        ),
      ]),
      '',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'el-message-box-confirm',
      },
    )
      .then(() => {
        onConfirm(data);
      })
      .catch(() => {});
  };

  const onImport = (data?: Property.Instance) => {
    state.currentProperty = data || undefined;
    state.importDialog = true;
  };

  const onSearch = () => {
    state.isSearch = true;
    getList();
  };

  // 取消搜索
  const cancelSearch = () => {
    state.isSearch = false;
    query.params.propertyCodeAndName = '';
    getList();
  };

  // 方法
  const getList = () => {
    const data = Object.assign({}, query);
    Object.assign(data.params, {});
    // 因为 request[变量]的类型推断问题没有搞定 暂时先拿到外部处理请求函数
    requestV2.propertyList(data).then((response) => {
      if (props.detail) {
        const data = pickDataForProperty(props.detail);
        data.children = response.data;
        state.tableData = [data];
        nextTick(() => {
          state.cells = document.querySelectorAll('.special-column');
          state.cells.forEach((cell, index) => {
            if (cell.scrollHeight > cell.clientHeight) {
              state.cellsShowPopover[index] = undefined;
            } else {
              state.cellsShowPopover[index] = false;
            }
          });
        });
      }
    });
  };

  // 导入回调函数
  const importConfirm = (value: string) => {
    try {
      const dataStr = JSON.parse(value);
      const data = {
        data: dataStr,
        replacements: {
          ...query.replacements,
        },
        params: {
          parentId: 0,
        },
      };
      if (state.currentProperty) {
        data.params.parentId = state.currentProperty.id || 0;
      }
      requestV2.propertyImport(data).then(() => {
        getList();
        state.importDialog = false;
      });
    } catch (error) {
      ElMessage.error('JSON数据解析失败');
    }
  };

  const enumsManage = () => {
    const path = {
      path: '/enumManagementNew',
      query: route.query,
    };
    go(path);
  };

  const handleRowClick = (row: Property.InstanceBySource) => {
    console.log('row', row);
    listRef.value && listRef.value && listRef.value.toggleRowExpansion(row);
  };
</script>
