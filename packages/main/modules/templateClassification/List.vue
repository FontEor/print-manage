<template>
  <div class="template-list-wrap action-close-searh">
    <List
      ref="listRef"
      :query="query"
      :request-fn="requestFn"
      @reset-query="onResetQuery"
      :is-tree="true"
    >
      <!-- 查询 开始 -->
      <template #form>
        <el-form-item label="名称/编码" label-width="80px">
          <el-input
            class="w-280"
            v-model="query.params.skey"
            placeholder="输入分类名称或编码，如：京东快递"
          />
        </el-form-item>
      </template>
      <template #action>
        <p class="template-list-btn">
          <el-button type="primary" @click="onAdd()">创建一级分类</el-button>
        </p>
      </template>
      <!-- 表格列开始 -->
      <template #column>
        <el-table-column label="分类编码" min-width="260px" prop="code" />
        <el-table-column label="分类名称" min-width="180px" prop="name" />
        <el-table-column label="更新人" prop="updateUser" min-width="120px" />
        <el-table-column label="更新时间" prop="updateTime" width="180px" />
        <el-table-column label="创建人" prop="createUser" min-width="120px" />
        <el-table-column label="创建时间" prop="createTime" width="180px" />
        <el-table-column label="操作" prop="id" width="230px" fixed="right">
          <template #default="scope">
            <template v-if="scope.row.readOnly">
              <el-tooltip
                v-if="scope.row.level === 1"
                effect="dark"
                content="电子面单的分类请在【基础资料-承运商】中维护"
                placement="top"
              >
                <el-link
                  class="source-new-link mt-3 mr-16"
                  type="info"
                  :underline="false"
                  :disabled="true"
                  >创建二级分类
                </el-link>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="电子面单的分类请在【基础资料-承运商】中维护"
                placement="top"
              >
                <el-link
                  class="source-new-link mt-3 mr-16"
                  type="info"
                  :underline="false"
                  :disabled="true"
                  >编辑</el-link
                >
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="电子面单的分类请在【基础资料-承运商】中维护"
                placement="top"
              >
                <el-link
                  class="source-new-link mt-3"
                  type="info"
                  :underline="false"
                  :disabled="true"
                  >删除</el-link
                >
              </el-tooltip>
            </template>
            <template v-else>
              <el-link
                v-if="scope.row.level === 1"
                class="source-new-link mr-16"
                type="primary"
                :underline="false"
                @click="onAdd(scope.row)"
                >创建二级分类
              </el-link>
              <el-link
                class="source-new-link mr-16"
                type="primary"
                :underline="false"
                @click="onEdit(scope.row)"
                >编辑
              </el-link>
              <el-link
                class="source-new-link"
                type="primary"
                :underline="false"
                @click="onDelete(scope.row)"
                >删除</el-link
              >
            </template>
          </template>
        </el-table-column>
      </template>
    </List>
    <CreateDialog
      :visible="state.showCreate"
      @closed="onClosed"
      @confirm="onConfirm"
      :level="state.level"
      :parentId="state.parentId"
    />
    <EditorDialog
      :visible="state.showEditor"
      @closed="onClosed"
      @confirm="onConfirm"
      :level="state.level"
      :data="state.detail"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ComponentPublicInstance, defineComponent, reactive, ref, h } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  import List from '@/components/ListNew.vue';
  import CreateDialog from './Create.vue';
  import EditorDialog from './Editor.vue';

  import { requestV2 } from '@/axios/request';
  import { TemplateClassification } from '@/types/apis/template-classification';

  const requestFn = requestV2.templateClassifyListPageList;

  // 查询条件数据
  const query: TemplateClassification.ListAxios = reactive({
    params: {
      skey: '',
      isPage: 0,
    },
  });

  // data数据
  const state = reactive({
    showCreate: false,
    showEditor: false,
    level: 1 as 1 | 2,
    parentId: undefined as number | undefined,
    detail: {} as TemplateClassification.ListInstance,
  });

  // 重置查询
  const onResetQuery = () => {
    query.params.skey = '';
  };

  // 查询ref
  const listRef = ref<ComponentPublicInstance<typeof List>>();

  const onRefreshList = () => {
    if (listRef.value) {
      listRef.value.getList();
    }
  };

  const onClosed = () => {
    state.showCreate = false;
    state.showEditor = false;
  };

  const onConfirm = () => {
    onRefreshList();
    onClosed();
  };

  const onAdd = (data?: TemplateClassification.ListInstance) => {
    if (data) {
      state.level = 2;
      state.parentId = data.id;
    } else {
      state.level = 1;
      state.parentId = undefined;
    }
    state.showCreate = true;
  };

  const onEdit = (data: TemplateClassification.ListInstance) => {
    requestV2
      .templateClassifyDetail({
        replacements: {
          id: data.id,
        },
      })
      .then((response) => {
        state.level = data.level;
        state.showEditor = true;
        state.detail = response.data;
      });
  };

  const onDelete = (data: TemplateClassification.ListInstance) => {
    ElMessageBox.confirm(
      h('div', { class: 'el-message-box-confirm-body' }, [
        h('div', { class: 'el-message-box-confirm_title' }, '提示'),
        h(
          'div',
          { class: 'el-message-box-confirm_content' },
          `确认删除此模板分类：${data.name} 么？`,
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
          .templateClassifyDelete({
            replacements: {
              id: data.id,
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
    name: 'TemplateClassificationComponent',
  });
</script>
