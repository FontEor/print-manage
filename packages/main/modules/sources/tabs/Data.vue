<template>
  <div class="tab-list-container">
    <el-container ref="listContainer" class="list-container">
      <el-form class="list-search" ref="formRef" style="height: 62px" :inline="true" :model="query">
        <el-form-item label="" label-width="0px">
          <el-input v-model="query.params.propertyCodeAndName" placeholder="请输入标识或显示名称" />
        </el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-form-item class="search-active-container">
          <el-button @click="onImport()" type="primary">导入JSON</el-button>
          <el-button @click="onEdit">编辑字段</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="state.tableData" ref="ruleFormRef" label-width="0px">
        <el-table
          ref="listRef"
          class="input-table"
          :class="{
            'table-form-view': state.disabled,
          }"
          stripe
          :height="tableHeight"
          :data="state.tableData"
          row-key="id"
          :load="getList"
          lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
        >
          <el-table-column prop="propertyCode" label="标识" min-width="200px" />
          <el-table-column prop="propertyName" label="显示名称" min-width="200px">
            <template #default="scope">
              <el-form-item
                :label="''"
                :prop="scope.$index !== 0 ? scope.row.$index + '.propertyName' : undefined"
                :rules="nameRule"
              >
                <el-input
                  v-model="scope.row.propertyName"
                  :disabled="state.disabled || scope.$index === 0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="dataType" label="类型" min-width="100px">
            <template #default="scope">
              <el-select
                v-model="scope.row.dataType"
                placeholder="请选择类型"
                :disabled="state.disabled || scope.$index === 0"
              >
                <el-option
                  v-for="type in dataTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="simpData" label="示例值" min-width="200px">
            <template #default="scope">
              <el-form-item
                v-if="scope.row.dataType === 2"
                label=""
                :prop="scope.$index !== 0 ? scope.row.$index + '.simpData' : undefined"
                :rules="length100Rule"
              >
                <el-input
                  v-model="scope.row.simpData"
                  :disabled="state.disabled || scope.$index === 0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="说明" min-width="200px">
            <template #default="scope">
              <el-form-item
                label=""
                :prop="scope.$index !== 0 ? scope.row.$index + '.remark' : undefined"
                :rules="length100Rule"
              >
                <el-input
                  v-model="scope.row.remark"
                  :disabled="state.disabled || scope.$index === 0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路径" min-width="120px" />
          <el-table-column prop="enumItemName" label="枚举项名称" min-width="120px" />
          <el-table-column prop="id" label="操作" width="330px">
            <template #default="scope">
              <el-button
                v-if="scope.row.dataType !== 2"
                :disabled="!state.disabled"
                link
                type="primary"
                @click="onAdd(scope.row)"
                >+字段</el-button
              >
              <el-button
                v-if="scope.row.dataType !== 2 && scope.$index !== 0"
                :disabled="!state.disabled"
                link
                type="primary"
                @click="onImport(scope.row)"
                >导入JSON</el-button
              >
              <el-button
                v-show="scope.$index !== 0"
                :disabled="!state.disabled"
                link
                type="primary"
                @click="onDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                v-if="scope.row.dataType === 2"
                :disabled="!state.disabled"
                link
                type="primary"
                @click="onRelationDialog(scope.row)"
                >{{ scope.row.enumItemId ? '更换枚举' : '关联枚举' }}</el-button
              >
              <el-button
                v-if="scope.row.dataType === 2 && scope.row.enumItemId"
                :disabled="!state.disabled"
                link
                type="primary"
                @click="onRelation(scope.row, 0)"
                >取消枚举</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="tab-list-container-save" v-show="!state.disabled">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSaveAll">保存</el-button>
      </div>
    </el-container>
    <JsonDialog
      v-model:visible="state.importDialog"
      @update:visible="state.importDialog = $event"
      :confirm-fn="importConfirm"
    />
    <CreateDialog
      :visible="state.showCreate"
      @closed="onClosed"
      :detail="props.detail"
      :property="state.currentProperty"
    />
    <RelationDialog
      v-model:visible="state.showRelationDialog"
      :data="state.currentProperty"
      :confirm-fn="onRelation"
      @closed="state.showRelationDialog = false"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    reactive,
    computed,
    watch,
    onMounted,
    onUnmounted,
    InjectionKey,
    ComponentPublicInstance,
  } from 'vue';
  import { debounce, cloneDeep, property } from 'lodash';
  import type { PropType } from 'vue';
  import { TreeNode } from 'element-plus/lib/components/table/src/table/defaults';
  import type { FormRules } from 'element-plus';
  import type { ElForm as ElFormType } from 'element-plus';

  import JsonDialog from '../../../components/json/JsonDialog.vue';
  import CreateDialog from './Create.vue';
  import RelationDialog from './RelationDialog.vue';

  import { ComputedTableHeightParams } from '../../../mixins/c_list';
  import { dataTypes } from '../../../const/enums';

  import { requestV1 } from '@/axios/request';
  import { router } from '../../../router';
  import storeMain from '../../../store';
  import { Property, SourceData } from '../../../types/apis/sourceData';
  import { ElMessage, ElMessageBox, ElTable, ElForm } from 'element-plus';
  import { propertyFormatListBack, propertyFormatPut } from '../../../axios/format/property/list';
  import { CN_EN_NUM } from '../../../const/regexp';
  import { Message } from '@element-plus/icons-vue';
  import { Session } from '../../../utils/session';
  import { EnumsManage } from '../../../types/apis/enumManage';

  const listRef = ref<ComponentPublicInstance<typeof ElTable>>();

  const props = defineProps({
    detail: {
      type: Object as PropType<SourceData.Instance>,
    },
  });

  const nameRule = [
    {
      required: true,
      message: '请输入名称',
    },
    {
      pattern: CN_EN_NUM,
      message: '支持中英文字符、阿拉伯数字，不得超过50个字符',
    },
    {
      min: 0,
      max: 50,
      message: '不得超过50个字符',
    },
  ];
  const length100Rule = [
    {
      min: 0,
      max: 100,
      message: '不得超过100个字符',
    },
  ];

  // 查询条件数据
  const query = reactive({
    params: {
      parentId: '',
      propertyCodeAndName: '',
    },
    replacements: {
      sourceId: '',
      id: '',
    },
  } as Property.ListAxios);

  // data数据
  const state = reactive({
    showCreate: false,
    showRelationDialog: false,
    importDialog: false,
    disabled: true,
    tableData: [] as Property.InstanceBySource[],
    root: {},
    currentProperty: undefined as undefined | Property.Instance | Property.InstanceBySource,
    treeData: [],
    dataTypes,
    CN_EN_NUM,
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
      id: detail.id,
      propertyCode: detail.code,
      propertyName: detail.name,
      dataType: 1, // 对象类型
      remark: detail.remark,
      path: detail.code,
      children: [],
      // 仿造数据 好像没有
      sourceId: 0,
      enumItemId: 0, // 枚举项ID
      enumItemName: '', // 枚举项名称
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

  // 重置查询
  const onResetQuery = () => {
    query.params.propertyCodeAndName = '';
  };

  const onClosed = ({ refresh }: { refresh: boolean }) => {
    state.showCreate = false;
    if (refresh && props.detail) {
      getList();
    }
  };

  // 查看详情（copy的之前的代码，代码中未用到此方法，若后续需添加此方法，需检查跳转路由是否正确）
  const onDetail = (id: string) => {
    router.push({
      name: 'accountDetail',
      query: {
        id: id,
      },
    });
  };

  // 添加字段
  const onAdd = (parentData: Property.Instance | Property.InstanceBySource) => {
    // 如果不是根节点
    if (!parentData.orgId) {
      state.currentProperty = parentData as Property.Instance;
    } else {
      state.currentProperty = undefined;
    }
    state.showCreate = true;
  };

  const onEdit = () => {
    state.disabled = false;
  };

  const onDelete = (data: Property.Instance) => {
    ElMessageBox.confirm(`本字段所有信息都将被删除，您确认要删除该数据源吗？`, '删除提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
    }).then(() => {
      requestV1
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
    });
  };

  const onImport = (data?: Property.Instance | Property.InstanceBySource) => {
    state.currentProperty = data;
    state.importDialog = true;
  };

  const onSearch = () => {
    getList();
  };

  const onCancel = () => {
    getList();
    state.disabled = true;
  };

  const onSaveAll = () => {
    ruleFormRef.value?.validate((valid: boolean) => {
      if (valid) {
        if (state.tableData) {
          const instances = propertyFormatListBack(
            cloneDeep(state.tableData[0].children) as Property.Instance[],
          );
          const datas = propertyFormatPut(instances);
          requestV1
            .propertyUpdate({
              replacements: {
                id: `${props.detail?.orgId}`,
                sourceId: `${props.detail?.id}`,
              },
              data: datas,
            })
            .then(() => {
              ElMessage.success('编辑成功');
              state.disabled = true;
              getList();
            });
        } else {
          ElMessage.error('数据验证不通过');
        }
      }
    });
  };

  // 自动计算表格高度 开始
  const tableHeight = ref(0);
  const listContainer = ref<ComponentPublicInstance<HTMLDivElement>>();
  const formRef = ref<ComponentPublicInstance<typeof ElFormType>>();
  const ruleFormRef = ref<ComponentPublicInstance<typeof ElFormType>>();

  const computedTableHeight = ({ listContainer, form }: ComputedTableHeightParams): number => {
    const $container = listContainer.value?.$el;
    const $form = form.value?.$el;
    const containerHeight = parseFloat(window.getComputedStyle($container).height);
    const formHeight = parseFloat(window.getComputedStyle($form).height);
    return containerHeight - formHeight - 40;
  };
  const debounceComputedTableHeight = debounce(() => {
    tableHeight.value = computedTableHeight({
      listContainer: listContainer,
      form: formRef,
    });
  });

  // 加载
  onMounted(() => {
    // 请求角色列表
    debounceComputedTableHeight();
    window.addEventListener('resize', debounceComputedTableHeight);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', debounceComputedTableHeight);
  });

  // 方法
  const getList = () => {
    const data = Object.assign({}, query);
    Object.assign(data.params, {});
    // 因为 request[变量]的类型推断问题没有搞定 暂时先拿到外部处理请求函数
    requestV1.propertyList(data).then((response) => {
      if (props.detail) {
        const data = pickDataForProperty(props.detail);
        data.children = response.data;
        state.tableData = [data];
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
        data.params.parentId = state.currentProperty.id;
      }
      requestV1.propertyImport(data).then(() => {
        getList();
        state.importDialog = false;
      });
    } catch (error) {
      ElMessage.error('JSON数据解析失败');
    }
  };

  const onRelationDialog = (data: Property.Instance) => {
    state.currentProperty = data;
    state.showRelationDialog = true;
  };

  const onRelation = (
    data: Property.Instance | Property.InstanceBySource,
    relation: 0 | 1,
    enumData?: EnumsManage.Instance,
  ) => {
    requestV1
      .propertyRelationEnum({
        replacements: {
          orgId: Session.getOrgId(),
          sourceId: data.sourceId,
        },
        data: {
          bindStatus: relation,
          enumItemId: enumData?.id || data.enumItemId,
          id: data.id,
        },
      })
      .then(() => {
        state.showRelationDialog = false;
        if (relation === 0) {
          ElMessage.success('取消关联成功');
        } else {
          ElMessage.success('关联成功');
        }
        getList();
      });
  };
</script>

<style></style>
