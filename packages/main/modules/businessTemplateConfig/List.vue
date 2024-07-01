<template>
  <div class="template-list-wrap action-close-searh">
    <List ref="listRef" :query="query" :request-fn="requestFn" @reset-query="onResetQuery">
      <!-- 查询 开始 -->
      <template #form>
        <el-form-item label-width="120px" label="商家编码类型">
          <el-select
            clearable
            v-model="query.params.traderCodeType"
            class="m-2"
            placeholder="商家编码类型"
          >
            <el-option
              v-for="item in state.businessCodeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商家编码/名称" label-width="120px">
          <el-input v-model="query.params.traderCodeOrName" placeholder="输入商家编码或名称" />
        </el-form-item>
        <el-form-item
          class="width-adjustment width-fixed"
          label="模板分类"
          label-width="100"
          fixed="right"
        >
          <el-cascader
            v-model="query.params.categories"
            :options="state.categoryList"
            :props="{ multiple: false, value: 'code', label: 'name' }"
            class="list-search_item"
            clearable
            collapse-tags
            collapse-tags-tooltip
            filterable
            placeholder="选择模板分类"
          />
        </el-form-item>
        <el-form-item label="模板编码/名称" label-width="120px">
          <el-input v-model="query.params.codeOrName" placeholder="输入模板编码或名称" />
        </el-form-item>
      </template>
      <template #action>
        <p class="template-list-btn">
          <el-button type="primary" @click="onAdd">新建</el-button>
        </p>
      </template>
      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="序号" type="index" width="80" />
        <!--        <el-table-column label="商家编码类型" min-width="120px" prop="traderCodeType" />-->
        <el-table-column label="商家编码类型" min-width="120px" prop="traderCodeName" />
        <el-table-column label="商家编码" min-width="180px" prop="traderCode" />
        <el-table-column label="商家名称" min-width="120px" prop="traderName" />
        <el-table-column label="模板分类" min-width="180px" prop="templateFirstCategoryName">
          <template #default="scope">
            <div
              >{{ scope.row.templateFirstCategoryName }}/{{
                scope.row.templateSecondCategoryName
              }}</div
            >
          </template>
        </el-table-column>
        <el-table-column label="模板编码" min-width="120px" prop="templateCode" />
        <el-table-column label="模板名称" min-width="120px" prop="templateName" />
        <el-table-column label="更新人" prop="updateUser" />
        <el-table-column label="更新时间" prop="updateTime" width="180px" />
        <el-table-column label="操作" prop="id" width="150px" fixed="right">
          <template #default="scope">
            <el-link
              class="source-new-link"
              type="primary"
              :underline="false"
              @click="onEdit(scope.row)"
              >修改
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="onDelete(scope.row)"
              class="ml-16 source-new-link"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog :visible="state.showCreate" @closed="onClosed" @confirm="onConfirm" />
    <EditorDialog
      :visible="state.showEditor || state.showView"
      @closed="onClosed"
      @confirm="onConfirm"
      :data="state.detail"
      :is-view="state.showView"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ComponentPublicInstance, defineComponent, onMounted, reactive, ref, h } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  import List from '@/components/ListNew.vue';
  import CreateDialog from './Create.vue';
  import EditorDialog from './Editor.vue';

  import { requestV2 } from '@/axios/request';
  import { BusinessTemplateConfig } from '@/types/apis/business-template-config';
  import selectList from '@/mixins/selectList';
  import { TemplateCategory } from '@/types/apis/template-category';
  import { businessCodeTypes } from '@/enums/business';
  import { Session } from '@/utils/session';

  const requestFn = requestV2.businessTemplateConfigList;

  // 查询条件数据
  const query: BusinessTemplateConfig.ListAxios = reactive({
    params: {
      traderCodeType: undefined,
      traderCodeOrName: '',
      categories: [],
      codeOrName: '',
    },
    replacements: {
      orgId: Session.getOrgId() as number,
    },
  });

  // data数据
  const state = reactive({
    showCreate: false,
    showEditor: false,
    showView: false,
    businessCodeType: businessCodeTypes,
    categoryList: [] as TemplateCategory.Instance[], // 模板分类列表
    detail: {} as BusinessTemplateConfig.DetailInstance,
  });

  const { getCategoryList } = selectList(state);

  // 重置查询
  const onResetQuery = () => {
    query.params = {
      traderCodeType: undefined,
      traderCodeOrName: '',
      categories: [],
      codeOrName: '',
    };
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  // 加载
  onMounted(() => {
    getCategoryList();
  });

  const onRefreshList = () => {
    if (listRef.value) {
      listRef.value.getList();
    }
  };

  const onClosed = () => {
    state.showCreate = false;
    state.showEditor = false;
    state.showView = false;
  };

  const onConfirm = () => {
    onRefreshList();
    onClosed();
  };

  const onAdd = () => {
    state.showCreate = true;
  };

  const onEdit = (data: BusinessTemplateConfig.Instance) => {
    requestV2
      .businessTemplateConfigDetail({
        replacements: {
          id: data.id,
          orgId: Session.getOrgId() as number,
        },
      })
      .then((response) => {
        state.showEditor = true;
        state.detail = response.data;
      });
  };

  const onDelete = (data: BusinessTemplateConfig.Instance) => {
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '是否确认删除'),
        h(
          'div',
          { class: 'el-message-box-confirm_content' },
          '删除此条配置后，商家将不能再使用此模板进行打单，您确认删除吗？',
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
        requestV2
          .businessTemplateConfigDelete({
            replacements: {
              id: data.id,
              orgId: Session.getOrgId() as number,
            },
          })
          .then(() => {
            ElMessage.success('删除成功');
            listRef.value?.getList();
          });
      })
      .catch(() => {});
  };

  defineComponent({
    name: 'BusinessTemplateConfigList',
  });
  defineExpose({
    resetQuery: onResetQuery,
  });
</script>
